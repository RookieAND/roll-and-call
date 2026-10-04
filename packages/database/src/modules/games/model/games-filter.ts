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

// 세션 시작 시각(KST)의 시가 [시작, 끝)에 들면 그 시간대다.
export const GAME_TIME_SLOT = {
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night",
} as const;

export type GameTimeSlot = (typeof GAME_TIME_SLOT)[keyof typeof GAME_TIME_SLOT];

export const GAME_TIME_SLOT_HOURS = {
  morning: [6, 12],
  afternoon: [12, 18],
  evening: [18, 24],
  night: [0, 6],
} as const satisfies Record<GameTimeSlot, readonly [number, number]>;

// 룰 필터의 「기타」: 룰북이 연결되지 않은 구인.
export const GAME_RULE_OTHER = "other";

export type GamesFilter = {
  q?: string;
  sort?: GameSort;
  tab?: GameTab;
  status?: GameStatusFilter;
  // 룰 분류 id 또는 GAME_RULE_OTHER
  rules?: string[];
  // 0 = 일요일 ~ 6 = 토요일
  days?: number[];
  times?: GameTimeSlot[];
  // 없으면 true로 본다.
  includeUnscheduled?: boolean;
};
