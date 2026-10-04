import "server-only";
import { isAbsenceActive } from "@roll-and-call/database/games/model";

import { countPlayedSessions } from "./count-played-sessions";
import { countRecentNoShows } from "./count-recent-no-shows";
import { isSanctioned } from "./is-sanctioned";
import { previousNicknameOf } from "./previous-nickname-of";
import { loadSnapshot, type Snapshot } from "./snapshot";
import { staffMemoRowsOf } from "./staff-memo-rows-of";
import type { Session } from "./types";

const nicknameOf = (db: Snapshot, userId: string) =>
  db.users.find((user) => user.id === userId)?.nickname ?? "";

export async function getUserDetail(userId: string) {
  const db = await loadSnapshot();
  const user = db.users.find((candidate) => candidate.id === userId);
  if (!user) return null;
  const now = Date.now();
  const sanction = isSanctioned(user, now) ? user.sanction! : null;
  const sanctionCount = db.auditLog.filter(
    (entry) => entry.action === "제재" && entry.targetUserId === userId,
  ).length;
  const mine = (session: Session) => session.gmId === userId || session.memberIds.includes(userId);
  const noShowOf = (sessionId: string) =>
    db.noShows.find((noShow) => noShow.userId === userId && noShow.sessionId === sessionId);

  const certifications = db.certifications
    .filter((item) => item.userId === userId)
    .map((item) => {
      const approved = db.certApplications.find(
        (application) =>
          application.userId === userId &&
          application.rulebookId === item.rulebookId &&
          application.status === "approved",
      );
      return {
        rulebookId: item.rulebookId,
        rulebook: item.rulebook,
        format: approved && !approved.direct ? approved.format : null,
        approvedAt: item.approvedAt,
        approvedBy: item.approvedBy,
      };
    });
  const applications = db.certApplications
    .flatMap((item) =>
      item.userId === userId && (item.status === "pending" || item.status === "rejected")
        ? [{ ...item, status: item.status }]
        : [],
    )
    .map((item) => ({
      id: item.id,
      rulebook: item.rulebook,
      format: item.direct ? null : item.format,
      status: item.status,
      rejectReason: item.rejectReason ?? null,
      appliedAt: item.appliedAt,
      processedAt: item.processedAt ?? null,
      processedBy: item.processedBy ?? null,
    }));

  return {
    id: user.id,
    nickname: user.nickname,
    discordId: user.discordId,
    discordHandle: user.discordHandle,
    membership: user.membership,
    ban: user.ban ?? null,
    previousNickname: previousNicknameOf({
      auditLog: db.auditLog,
      userId,
      nickname: user.nickname,
    }),
    joinedAt: user.memberJoinedAt,
    rejoinedAt: user.rejoinedAt ?? null,
    leftAt: user.leftAt ?? null,
    staffRole: db.staff.find((member) => member.userId === userId)?.role ?? null,
    hostedCount: user.hostedCount,
    playedCount: countPlayedSessions({ db, userId, now: new Date(now) }),
    recentNoShowCount: countRecentNoShows(db, userId, now),
    sanction,
    // 지금 걸린 제재는 지난 제재로 세지 않는다.
    pastSanctionCount: Math.max(0, sanctionCount - (sanction ? 1 : 0)),
    unbanned: db.auditLog.some(
      (entry) => entry.action === "차단 해제" && entry.targetUserId === userId,
    ),
    certifications,
    applications,
    activities: db.sessions
      .filter((session) => mine(session) && session.startsAt.getTime() < now)
      .toSorted((a, b) => b.startsAt.getTime() - a.startsAt.getTime())
      .map((session) => {
        const noShow = noShowOf(session.id);
        return {
          sessionId: session.id,
          startsAt: session.startsAt,
          hosted: session.gmId === userId,
          title: session.title,
          rulebook: session.rulebook,
          gmNickname: nicknameOf(db, session.gmId),
          noShow: noShow ? { id: noShow.id, cancelled: noShow.cancelled } : null,
        };
      }),
    noShows: db.noShows
      .filter((noShow) => noShow.userId === userId)
      .map((noShow) => {
        const session = db.sessions.find((candidate) => candidate.id === noShow.sessionId)!;
        return {
          id: noShow.id,
          sessionTitle: session.title,
          startsAt: session.startsAt,
          recordedBy: noShow.added ? `${noShow.added.by} · 운영진` : nicknameOf(db, session.gmId),
          cancelled: noShow.cancelled,
          expired:
            !noShow.cancelled && !isAbsenceActive({ sessionStartsAt: session.startsAt, now }),
        };
      })
      .toSorted((a, b) => b.startsAt.getTime() - a.startsAt.getTime()),
    memos: staffMemoRowsOf({ db, userId }),
  };
}

export type UserDetail = NonNullable<Awaited<ReturnType<typeof getUserDetail>>>;
