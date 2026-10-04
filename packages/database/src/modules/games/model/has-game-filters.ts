import type { GamesFilter } from "./games-filter";

export function hasGameFilters(filter: GamesFilter): boolean {
  return Boolean(
    filter.rules?.length ||
    filter.days?.length ||
    filter.times?.length ||
    filter.includeUnscheduled === false,
  );
}
