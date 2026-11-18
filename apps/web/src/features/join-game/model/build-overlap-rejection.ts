import type { ScheduleOverlap } from "@roll-and-call/database/games";

import { OVERLAP_MESSAGE, OVERLAP_REASON, type OverlapRejection } from "./overlap-rejection";

export function buildOverlapRejection({
  targetRoundCount,
  overlaps,
}: {
  targetRoundCount: number;
  overlaps: readonly [ScheduleOverlap, ...ScheduleOverlap[]];
}): OverlapRejection {
  return {
    error: OVERLAP_MESSAGE,
    reason: OVERLAP_REASON,
    overlapGameId: overlaps[0].gameId,
    targetRoundCount,
    overlaps: overlaps.map(
      ({ targetRoundNo, gameTitle, gameRoundCount, roundNo, startsAt, endsAt }) => ({
        targetRoundNo,
        gameTitle,
        gameRoundCount,
        roundNo,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
      }),
    ),
  };
}
