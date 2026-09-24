import "server-only";
import type { Snapshot } from "./snapshot";

const THREE_MONTHS = 91 * 86_400_000;

// 취소되지 않은 불참 중 최근 3개월 안의 것만 센다.
export function countRecentNoShows(db: Snapshot, userId: string, now: number = Date.now()) {
  return db.noShows.filter((noShow) => {
    if (noShow.userId !== userId || noShow.cancelled) return false;
    const session = db.sessions.find((candidate) => candidate.id === noShow.sessionId)!;
    return now - session.startsAt.getTime() < THREE_MONTHS;
  }).length;
}
