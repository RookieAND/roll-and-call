import { isAbsenceActive } from "#db/modules/games/model";

import { sessionPlayerIds, type PlayerCountSession } from "./session-player-ids";

interface CountSession extends PlayerCountSession {
  id: string;
  startsAt: Date;
}

interface CountNoShow {
  userId: string;
  sessionId: string;
  cancelled: boolean;
  // 다회차에서 불참으로 내보낸 회차의 시작. 30일은 세션 시작이 아니라 이 시각부터 센다.
  absenceAt?: Date | null;
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

// 확정으로 참여한 인정 세션 수(다회차는 완주한 구인만). 취소되지 않은 불참(기간이 지난 것 포함)이 있는 세션은 참여로 세지 않는다.
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
    for (const userId of sessionPlayerIds(session, now)) {
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
    const startsAt = noShow.absenceAt ?? startsAtOf.get(noShow.sessionId);
    if (startsAt && isAbsenceActive({ sessionStartsAt: startsAt, now })) {
      increment(counts, noShow.userId);
    }
  }
  return counts;
}
