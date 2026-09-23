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

// 진행 중 = 지금 신청할 수 있는 글(모집 중·대기 접수 중). 나머지는 지난 구인이다.
export const GAME_TAB = {
  live: "live",
  past: "past",
} as const;

export type GameTab = (typeof GAME_TAB)[keyof typeof GAME_TAB];

export const GAME_TAB_DEFAULT: GameTab = GAME_TAB.live;

export const GAME_STATUS_FILTER = {
  all: "all",
  recruiting: "recruiting",
  waitlist: "waitlist",
  closed: "closed",
  ended: "ended",
} as const;

export type GameStatusFilter = (typeof GAME_STATUS_FILTER)[keyof typeof GAME_STATUS_FILTER];

export const GAME_STATUS_FILTERS = {
  live: [
    { key: GAME_STATUS_FILTER.all, label: "전체" },
    { key: GAME_STATUS_FILTER.recruiting, label: "모집 중" },
    { key: GAME_STATUS_FILTER.waitlist, label: "대기 접수 중" },
  ],
  past: [
    { key: GAME_STATUS_FILTER.all, label: "전체" },
    { key: GAME_STATUS_FILTER.closed, label: "마감" },
    { key: GAME_STATUS_FILTER.ended, label: "종료" },
  ],
} as const satisfies Record<GameTab, ReadonlyArray<{ key: GameStatusFilter; label: string }>>;

export const GAME_STATUS_FILTER_DEFAULT: GameStatusFilter = GAME_STATUS_FILTER.all;

export type GamesFilter = {
  q?: string;
  sort?: GameSort;
  tab?: GameTab;
  status?: GameStatusFilter;
};
