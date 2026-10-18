import { isAbsenceActive, isRecognizedPost } from "#db/modules/games/model";

interface CountSession {
  id: string;
  memberIds: readonly string[];
  startsAt: Date;
  hidden?: unknown;
  cancelled?: boolean;
  endsAt?: Date | null;
}

interface CountNoShow {
  userId: string;
  sessionId: string;
  cancelled: boolean;
}

interface CountOptions<Session extends CountSession> {
  sessions: readonly Session[];
  noShows: readonly CountNoShow[];
  now: Date;
  // 주면 이 사람들만 센다.
  userIds?: readonly string[];
}

function increment(counts: Map<string, number>, userId: string) {
  counts.set(userId, (counts.get(userId) ?? 0) + 1);
}

// 확정으로 참여한 인정 세션 수. 취소되지 않은 불참(기간이 지난 것 포함)이 있는 세션은 참여로 세지 않는다.
export function playedCountsByUser<Session extends CountSession>({
  sessions,
  noShows,
  now,
  userIds,
}: CountOptions<Session>) {
  const wanted = userIds && new Set(userIds);
  const absent = new Set(
    noShows.filter((noShow) => !noShow.cancelled).map((n) => `${n.sessionId}:${n.userId}`),
  );
  const counts = new Map<string, number>();
  for (const session of sessions) {
    if (!isRecognizedPost(session, now)) continue;
    for (const userId of session.memberIds) {
      if (wanted && !wanted.has(userId)) continue;
      if (!absent.has(`${session.id}:${userId}`)) increment(counts, userId);
    }
  }
  return counts;
}

// 지금 효력이 있는(30일 안, 취소 안 된) 불참 수.
export function recentNoShowCountsByUser<Session extends CountSession>({
  sessions,
  noShows,
  now,
  userIds,
}: CountOptions<Session>) {
  const wanted = userIds && new Set(userIds);
  const startsAtOf = new Map(sessions.map((session) => [session.id, session.startsAt]));
  const counts = new Map<string, number>();
  for (const noShow of noShows) {
    if (noShow.cancelled || (wanted && !wanted.has(noShow.userId))) continue;
    const startsAt = startsAtOf.get(noShow.sessionId);
    if (startsAt && isAbsenceActive({ sessionStartsAt: startsAt, now })) {
      increment(counts, noShow.userId);
    }
  }
  return counts;
}
