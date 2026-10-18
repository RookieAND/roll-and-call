import {
  GAME_SORT,
  GAME_STATUS_FILTER,
  GAME_TAB,
  GAME_TIME_SLOT,
  type GameSort,
  type GameStatusFilter,
  type GameTab,
  type GameTimeSlot,
} from "@roll-and-call/database/games/model";

export {
  GAME_RULE_OTHER,
  GAME_SORT,
  GAME_STATUS_FILTER,
  GAME_TAB,
  GAME_TIME_SLOT,
  gameFilterCount,
  hasGameFilters,
  type GameSort,
  type GameStatusFilter,
  type GameTab,
  type GameTimeSlot,
  type GamesFilter,
} from "@roll-and-call/database/games/model";

export const GAME_SORTS = [
  { key: GAME_SORT.latest, label: "최신순" },
  { key: GAME_SORT.deadline, label: "마감 임박순" },
  { key: GAME_SORT.slots, label: "남은 자리순" },
] as const satisfies ReadonlyArray<{ key: GameSort; label: string }>;

export const GAME_SORT_DEFAULT: GameSort = GAME_SORT.latest;

export const GAME_TAB_DEFAULT: GameTab = GAME_TAB.live;

export const GAME_STATUS_FILTERS = {
  live: [
    { key: GAME_STATUS_FILTER.all, label: "전체" },
    { key: GAME_STATUS_FILTER.recruiting, label: "모집 중" },
    { key: GAME_STATUS_FILTER.waitlist, label: "대기 접수 중" },
  ],
  past: [
    { key: GAME_STATUS_FILTER.all, label: "전체" },
    { key: GAME_STATUS_FILTER.closed, label: "모집 종료" },
    { key: GAME_STATUS_FILTER.ended, label: "종료" },
  ],
} as const satisfies Record<GameTab, ReadonlyArray<{ key: GameStatusFilter; label: string }>>;

export const GAME_STATUS_FILTER_DEFAULT: GameStatusFilter = GAME_STATUS_FILTER.all;

export const GAME_TIME_SLOTS = [
  { key: GAME_TIME_SLOT.morning, label: "오전", hint: "06~12시" },
  { key: GAME_TIME_SLOT.afternoon, label: "오후", hint: "12~18시" },
  { key: GAME_TIME_SLOT.evening, label: "저녁", hint: "18~24시" },
  { key: GAME_TIME_SLOT.night, label: "심야", hint: "00~06시" },
] as const satisfies ReadonlyArray<{ key: GameTimeSlot; label: string; hint: string }>;

// 인덱스 = 요일 번호(0 = 일요일)
export const GAME_WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;
