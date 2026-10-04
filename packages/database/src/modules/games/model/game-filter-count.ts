import type { GamesFilter } from "./games-filter";

export function gameFilterCount(filter: GamesFilter): number {
  const unscheduledCount = filter.includeUnscheduled === false ? 1 : 0;
  return (
    (filter.rules?.length ?? 0) +
    (filter.days?.length ?? 0) +
    (filter.times?.length ?? 0) +
    unscheduledCount
  );
}
