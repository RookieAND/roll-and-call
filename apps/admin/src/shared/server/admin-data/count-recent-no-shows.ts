import "server-only";
import { isAbsenceActive } from "@roll-and-call/database/games/model";

import type { Snapshot } from "./snapshot";

export function countRecentNoShows(db: Snapshot, userId: string, now: number = Date.now()) {
  return db.noShows.filter((noShow) => {
    if (noShow.userId !== userId || noShow.cancelled) return false;
    const session = db.sessions.find((candidate) => candidate.id === noShow.sessionId)!;
    return isAbsenceActive({ sessionStartsAt: session.startsAt, now });
  }).length;
}
