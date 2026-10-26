import "server-only";
import { REVIEW_WRITE_DAYS } from "@roll-and-call/database/games/model";
import { recentNoShowCountsByUser } from "@roll-and-call/database/moderation/model";

import { PAGE_SIZE } from "@/shared/lib";
import { loadAdminData, type Snapshot } from "@/shared/server";

import { postStatusOf } from "../model/post-status-of";
import { selectPostRows, type PostListFilter } from "../model/select-post-rows";
import { toPostRow } from "../model/to-post-row";

const DAY = 86_400_000;
// GM이 받은 조치로 세는 구인 조치(숨김 해제는 받은 조치가 아니다).
const RECEIVED_POST_ACTIONS: readonly string[] = ["구인 숨김", "구인 취소"];

const userOf = (db: Pick<Snapshot, "users">, userId: string) =>
  db.users.find((user) => user.id === userId)!;

interface GetPostDetailInput {
  id: string;
  filter: PostListFilter;
  pageSize?: number;
}

// filter는 들어온 목록의 검색·필터·정렬이고 pageSize는 그 목록의 쪽 크기다.
// [다음 건]은 그 목록에서 다음 구인과 그 구인이 있는 쪽이다.
export async function getPostDetail({ id, filter, pageSize = PAGE_SIZE }: GetPostDetailInput) {
  const db = await loadAdminData(["users", "sessions", "auditLog", "countingNoShows"]);
  const session = db.sessions.find((candidate) => candidate.id === id);
  if (!session) return null;
  const now = Date.now();
  const gm = userOf(db, session.gmId);
  const gmGameIds = new Set(
    db.sessions.filter((candidate) => candidate.gmId === gm.id).map((candidate) => candidate.id),
  );
  const receivedActionCount = db.auditLog.filter(
    (entry) =>
      entry.targetGameId &&
      gmGameIds.has(entry.targetGameId) &&
      RECEIVED_POST_ACTIONS.includes(entry.action),
  ).length;
  const nicknames = new Map(db.users.map((user) => [user.id, user.nickname]));
  const listIds = selectPostRows({
    rows: db.sessions.map((candidate) => toPostRow({ nicknames, session: candidate })),
    ...filter,
  }).map((row) => row.id);
  const nextIndex = listIds.indexOf(id) + 1;
  const next =
    nextIndex > 0 && nextIndex < listIds.length
      ? { id: listIds[nextIndex]!, page: Math.floor(nextIndex / pageSize) + 1 }
      : null;
  const noShowCounts = recentNoShowCountsByUser({
    sessions: db.sessions,
    noShows: db.countingNoShows,
    now: new Date(now),
    userIds: session.memberIds,
  });
  const waitingIds = session.waitingIds ?? [];
  const cancelRecipientIds = new Set(session.staffCancelRecipientIds ?? []);
  const attendanceConfirmedAt = session.attendanceConfirmedAt;

  return {
    id: session.id,
    title: session.title,
    rulebook: session.rulebook,
    status: postStatusOf(session, now),
    isPrivate: session.isPrivate ?? false,
    sessionAt: session.timeFixed ? session.startsAt : null,
    memberCount: session.memberIds.length,
    waitingCount: waitingIds.length,
    capacity: session.capacity,
    recruitDeadline: session.recruitDeadline,
    playTime: session.playTime,
    genres: session.genres ?? [],
    triggers: session.triggers ?? [],
    platforms: session.platforms ?? [],
    aiImage: session.aiImage ?? false,
    kindLabel: session.kindLabel ?? "세션",
    playTypeLabel: session.playTypeLabel ?? "보이스",
    synopsis: session.synopsis,
    notices: session.notices ?? [],
    imageUrls: session.imageUrls ?? [],
    thumbnailUrl: session.thumbnailUrl,
    hidden: session.hidden,
    editedSinceHiddenAt: session.editedSinceHiddenAt,
    cancelled: session.cancelled ?? false,
    cancellable: !session.cancelBlock,
    sessionStarted: session.sessionStarted ?? false,
    cancelRecipients: {
      memberCount: session.memberIds.filter((userId) => cancelRecipientIds.has(userId)).length,
      waitingCount: waitingIds.filter((userId) => cancelRecipientIds.has(userId)).length,
    },
    next,
    applicationNoteEnabled: session.applicationNoteEnabled ?? false,
    conditionLines: [
      ...(session.minRulePlays
        ? [`${session.rulebook} 플레이 ${session.minRulePlays}회 이상`]
        : []),
      ...(session.requireRulebookCert ? [`${session.rulebook} 룰북 인증`] : []),
    ],
    members: session.memberIds.map((userId) => ({
      userId,
      hasApplicationNote: session.applicationNoteUserIds?.has(userId) ?? false,
      nickname: userOf(db, userId).nickname,
      discordHandle: userOf(db, userId).discordHandle,
      joinedAt: session.joinedAt?.get(userId),
      recentNoShowCount: noShowCounts.get(userId) ?? 0,
    })),
    waitlist: waitingIds.map((userId, index) => ({
      userId,
      listOrder: index + 1,
      hasApplicationNote: session.applicationNoteUserIds?.has(userId) ?? false,
      nickname: userOf(db, userId).nickname,
      discordHandle: userOf(db, userId).discordHandle,
      joinedAt: session.joinedAt?.get(userId),
    })),
    attendance: {
      confirmedAt: attendanceConfirmedAt,
      reviewDeadline:
        session.sessionStarted && session.endsAt
          ? new Date(session.endsAt.getTime() + REVIEW_WRITE_DAYS * DAY)
          : undefined,
    },
    gm: { id: gm.id, nickname: gm.nickname, receivedActionCount },
  };
}

export type PostDetail = NonNullable<Awaited<ReturnType<typeof getPostDetail>>>;
