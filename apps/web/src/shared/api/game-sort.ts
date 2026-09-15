export const GAME_SORT = {
  latest: "latest",
  deadline: "deadline",
  slots: "slots",
} as const;

export type GameSort = (typeof GAME_SORT)[keyof typeof GAME_SORT];

export const GAME_SORTS = [
  { key: GAME_SORT.latest, label: "최신순" },
  { key: GAME_SORT.deadline, label: "마감 임박순" },
  { key: GAME_SORT.slots, label: "남은 자리순" },
] as const satisfies ReadonlyArray<{ key: GameSort; label: string }>;

export const GAME_SORT_DEFAULT: GameSort = GAME_SORT.latest;

export const GAME_STATUS_FILTER = {
  all: "all",
  recruiting: "recruiting",
  waitlist: "waitlist",
  closed: "closed",
} as const;

export type GameStatusFilter = (typeof GAME_STATUS_FILTER)[keyof typeof GAME_STATUS_FILTER];

export const GAME_STATUS_FILTERS = [
  { key: GAME_STATUS_FILTER.all, label: "전체" },
  { key: GAME_STATUS_FILTER.recruiting, label: "모집 중" },
  { key: GAME_STATUS_FILTER.waitlist, label: "대기 접수 중" },
  { key: GAME_STATUS_FILTER.closed, label: "마감" },
] as const satisfies ReadonlyArray<{ key: GameStatusFilter; label: string }>;

export const GAME_STATUS_FILTER_DEFAULT: GameStatusFilter = GAME_STATUS_FILTER.all;

// status가 없으면 기한 안 글만 보여 준다(랜딩 "지금 모집 중"). 목록 화면은 항상 명시한다.
export type GamesFilter = { q?: string; sort?: GameSort; status?: GameStatusFilter };
