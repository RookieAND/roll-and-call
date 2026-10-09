import "server-only";
import { REVIEW_WRITE_DAYS } from "@roll-and-call/database/games/model";

import { PAGE_SIZE } from "@/shared/lib";

import { countRecentNoShows } from "./count-recent-no-shows";
import { postStatusOf } from "./post-status-of";
import { selectPostRows, type PostListFilter } from "./select-post-rows";
import { loadSnapshot, type Snapshot } from "./snapshot";
import { toPostRow } from "./to-post-row";

const DAY = 86_400_000;
// GM이 받은 조치로 세는 구인 조치(숨김 해제는 받은 조치가 아니다).
const RECEIVED_POST_ACTIONS: readonly string[] = ["구인 숨김", "구인 취소"];

const userOf = (db: Snapshot, userId: string) => db.users.find((user) => user.id === userId)!;

// filter는 들어온 목록의 검색·필터·정렬이다. [다음 건]은 그 목록에서 다음 구인과 그 구인이 있는 쪽이다.
export async function getPostDetail({ id, filter }: { id: string; filter: PostListFilter }) {
  const db = await loadSnapshot();
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
  const listIds = selectPostRows({
    rows: db.sessions.map((candidate) => toPostRow({ db, session: candidate })),
    ...filter,
  }).map((row) => row.id);
  const nextIndex = listIds.indexOf(id) + 1;
  const next =
    nextIndex > 0 && nextIndex < listIds.length
      ? { id: listIds[nextIndex]!, page: Math.floor(nextIndex / PAGE_SIZE) + 1 }
      : null;
  const waitingIds = session.waitingIds ?? [];
  const cancelRecipientIds = new Set(session.staffCancelRecipientIds ?? []);
  // ponytail: 작성 기한은 처음 출석 확인 + 7일로 어드민이 따로 계산한다. 사용자 앱(apps/web)의 계산과 같은 규칙이다.
  const attendanceConfirmedAt = session.attendanceConfirmedAt;
  const reviewWindowStart = session.attendanceFirstConfirmedAt ?? attendanceConfirmedAt;

  return {
    id: session.id,
    title: session.title,
    rulebook: session.rulebook,
    status: postStatusOf(session, now),
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
    members: session.memberIds.map((userId) => ({
      userId,
      hasApplicationNote: session.applicationNoteUserIds?.has(userId) ?? false,
      nickname: userOf(db, userId).nickname,
      discordHandle: userOf(db, userId).discordHandle,
      joinedAt: session.joinedAt?.get(userId),
      recentNoShowCount: countRecentNoShows(db, userId, now),
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
      reviewDeadline: reviewWindowStart
        ? new Date(reviewWindowStart.getTime() + REVIEW_WRITE_DAYS * DAY)
        : undefined,
    },
    gm: { id: gm.id, nickname: gm.nickname, receivedActionCount },
  };
}

export type PostDetail = NonNullable<Awaited<ReturnType<typeof getPostDetail>>>;
