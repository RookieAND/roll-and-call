import "server-only";
import type { Snapshot } from "./snapshot";

const THREE_MONTHS = 91 * 86_400_000;

export function countRecentNoShows(db: Snapshot, userId: string, now: number = Date.now()) {
  return db.noShows.filter((noShow) => {
    if (noShow.userId !== userId || noShow.cancelled) return false;
    const session = db.sessions.find((candidate) => candidate.id === noShow.sessionId)!;
    return now - session.startsAt.getTime() < THREE_MONTHS;
  }).length;
}
