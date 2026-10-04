import {
  GAME_SORT_DEFAULT,
  GAME_STATUS_FILTER_DEFAULT,
  GAME_TAB_DEFAULT,
  type GamesFilter,
} from "@/shared/api";

export function filterParams({
  q,
  sort,
  tab,
  status,
  rules,
  days,
  times,
  includeUnscheduled,
  page,
}: GamesFilter & { page?: number }) {
  return {
    q,
    tab: tab === GAME_TAB_DEFAULT ? undefined : tab,
    sort: sort === GAME_SORT_DEFAULT ? undefined : sort,
    status: status === GAME_STATUS_FILTER_DEFAULT ? undefined : status,
    rule: rules?.join(","),
    day: days?.join(","),
    time: times?.join(","),
    unscheduled: includeUnscheduled === false ? "0" : undefined,
    page: page && page > 1 ? page : undefined,
  };
}
