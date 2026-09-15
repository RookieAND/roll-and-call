import { GAME_SORT_DEFAULT, GAME_STATUS_FILTER_DEFAULT, type GamesFilter } from "@/shared/api";

export function filterParams({ q, sort, status, page }: GamesFilter & { page?: number }) {
  return {
    q,
    sort: sort === GAME_SORT_DEFAULT ? undefined : sort,
    status: status === GAME_STATUS_FILTER_DEFAULT ? undefined : status,
    page: page && page > 1 ? page : undefined,
  };
}
