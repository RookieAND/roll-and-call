import "server-only";
import { countRecentNoShows } from "./count-recent-no-shows";
import { isSanctioned } from "./is-sanctioned";
import { db } from "./mock-db";
import type { Session } from "./types";

const nicknameOf = (userId: string) => db.users.find((user) => user.id === userId)?.nickname ?? "";

// 진행 중인 활동 한 줄. 제재·인증 취소 모달이 "그대로 진행 / 빼기·닫기"를 고르게 한다.
const toOngoing = (session: Session, userId: string) => ({
  sessionId: session.id,
  title: session.title,
  rulebook: session.rulebook,
  startsAt: session.startsAt,
  hosted: session.gmId === userId,
  gmNickname: nicknameOf(session.gmId),
  memberCount: session.memberIds.length,
  capacity: session.capacity,
});

export type OngoingActivity = ReturnType<typeof toOngoing>;

export async function getUserDetail(userId: string) {
  const user = db.users.find((candidate) => candidate.id === userId);
  if (!user) return null;
  const now = Date.now();
  const mine = (session: Session) => session.gmId === userId || session.memberIds.includes(userId);
  const noShowOf = (sessionId: string) =>
    db.noShows.find((noShow) => noShow.userId === userId && noShow.sessionId === sessionId);

  const certifications = db.certifications
    .filter((item) => item.userId === userId)
    .map((item) => ({
      rulebook: item.rulebook,
      approvedAt: item.approvedAt,
      approvedBy: item.approvedBy,
    }));
  const applications = db.certApplications
    .filter((item) => item.userId === userId && item.status !== "approved")
    .map((item) => ({
      id: item.id,
      rulebook: item.rulebook,
      status: item.status as "pending" | "rejected",
      appliedAt: item.appliedAt,
      processedAt: item.processedAt ?? null,
      processedBy: item.processedBy ?? null,
    }));

  return {
    id: user.id,
    nickname: user.nickname,
    discordId: user.discordId,
    discordHandle: user.discordHandle,
    joinedAt: user.joinedAt,
    hostedCount: user.hostedCount,
    playedCount: user.playedCount,
    recentNoShowCount: countRecentNoShows(userId, now),
    sanction: isSanctioned(user, now) ? user.sanction! : null,
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
          gmNickname: nicknameOf(session.gmId),
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
          gmNickname: nicknameOf(session.gmId),
          cancelled: noShow.cancelled,
        };
      })
      .toSorted((a, b) => b.startsAt.getTime() - a.startsAt.getTime()),
    memos: db.staffMemos
      .filter((memo) => memo.userId === userId)
      .toSorted((a, b) => b.at.getTime() - a.at.getTime()),
    ongoing: db.sessions
      .filter((session) => mine(session) && !session.closed && session.startsAt.getTime() >= now)
      .toSorted((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
      .map((session) => toOngoing(session, userId)),
  };
}

export type UserDetail = NonNullable<Awaited<ReturnType<typeof getUserDetail>>>;
