export const GAME_SORT = {
  latest: "latest",
  deadline: "deadline",
  slots: "slots",
} as const;

export type GameSort = (typeof GAME_SORT)[keyof typeof GAME_SORT];

// 진행 중 = 지금 신청할 수 있는 글(모집 중·대기 접수 중). 나머지는 지난 구인이다.
export const GAME_TAB = {
  live: "live",
  past: "past",
} as const;

export type GameTab = (typeof GAME_TAB)[keyof typeof GAME_TAB];

export const GAME_STATUS_FILTER = {
  all: "all",
  recruiting: "recruiting",
  waitlist: "waitlist",
  closed: "closed",
  ended: "ended",
} as const;

export type GameStatusFilter = (typeof GAME_STATUS_FILTER)[keyof typeof GAME_STATUS_FILTER];

export type GamesFilter = {
  q?: string;
  sort?: GameSort;
  tab?: GameTab;
  status?: GameStatusFilter;
};
