export type GameSort = "latest" | "deadline" | "slots";

export const GAME_SORTS = [
  { key: "latest", label: "최신순" },
  { key: "deadline", label: "마감 임박순" },
  { key: "slots", label: "남은 자리순" },
] as const satisfies ReadonlyArray<{ key: GameSort; label: string }>;

export const GAME_SORT_DEFAULT: GameSort = "latest";

export function parseGameSort(value?: string): GameSort {
  return GAME_SORTS.find((o) => o.key === value)?.key ?? GAME_SORT_DEFAULT;
}

// 상태 필터 칩(?status=). 라벨은 모집 상태 배지(entities/game gameStatusLabel)와 같은 말을 쓴다.
export type GameStatusFilter = "all" | "recruiting" | "waitlist" | "closed";

export const GAME_STATUS_FILTERS = [
  { key: "all", label: "전체" },
  { key: "recruiting", label: "모집 중" },
  { key: "waitlist", label: "대기 접수 중" },
  { key: "closed", label: "마감" },
] as const satisfies ReadonlyArray<{ key: GameStatusFilter; label: string }>;

export const GAME_STATUS_FILTER_DEFAULT: GameStatusFilter = "all";

export function parseGameStatusFilter(value?: string): GameStatusFilter {
  return GAME_STATUS_FILTERS.find((o) => o.key === value)?.key ?? GAME_STATUS_FILTER_DEFAULT;
}

// 목록 조회 파라미터(검색어·정렬·상태). 서버 쿼리와 클라이언트 필터 UI가 같은 타입을 본다.
// status가 없으면 기한 안 글만(랜딩 "지금 모집 중"), 목록 화면은 항상 명시한다.
export type GamesFilter = { q?: string; sort?: GameSort; status?: GameStatusFilter };
