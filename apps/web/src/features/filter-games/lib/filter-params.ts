import { GAME_SORT_DEFAULT, GAME_STATUS_FILTER_DEFAULT, type GamesFilter } from "@/shared/api";

// 목록 필터를 쿼리 파라미터로. 기본값(최신순·전체)과 1페이지는 주소에 남기지 않는다.
export function filterParams({ q, sort, status, page }: GamesFilter & { page?: number }) {
  return {
    q,
    sort: sort === GAME_SORT_DEFAULT ? undefined : sort,
    status: status === GAME_STATUS_FILTER_DEFAULT ? undefined : status,
    page: page && page > 1 ? page : undefined,
  };
}
