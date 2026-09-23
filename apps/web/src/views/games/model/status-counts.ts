import { GAME_TAB, type GameStatusFilter, type GameTab } from "@/shared/api";
import type { GamesCounts } from "@/shared/server";

export function statusCounts({
  counts,
  tab,
}: {
  counts: GamesCounts;
  tab: GameTab;
}): Partial<Record<GameStatusFilter, number>> {
  if (tab === GAME_TAB.past)
    return { all: counts.past, closed: counts.closed, ended: counts.ended };
  return { all: counts.live, recruiting: counts.recruiting, waitlist: counts.waitlist };
}
