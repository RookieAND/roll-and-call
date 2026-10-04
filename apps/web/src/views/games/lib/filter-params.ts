import {
  GAME_SORT_DEFAULT,
  GAME_STATUS_FILTER_DEFAULT,
  GAME_TAB_DEFAULT,
  GAME_TIME_SLOTS,
  type GamesFilter,
} from "@/shared/api";

// 필터 목록은 parseGameFilters와 같은 순서로 적어, 같은 조건이 같은 주소가 되게 한다.
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
    rule: rules?.toSorted().join(","),
    day: days?.toSorted((left, right) => left - right).join(","),
    time: GAME_TIME_SLOTS.filter((slot) => times?.includes(slot.key))
      .map((slot) => slot.key)
      .join(","),
    unscheduled: includeUnscheduled === false ? "0" : undefined,
    page: page && page > 1 ? page : undefined,
  };
}
