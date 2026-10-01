import {
  GAME_SORT,
  GAME_STATUS_FILTER,
  GAME_TAB,
  type GameSort,
  type GameStatusFilter,
  type GameTab,
} from "@roll-and-call/database/rules";

export {
  GAME_SORT,
  GAME_STATUS_FILTER,
  GAME_TAB,
  type GameSort,
  type GameStatusFilter,
  type GameTab,
  type GamesFilter,
} from "@roll-and-call/database/rules";

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
    { key: GAME_STATUS_FILTER.closed, label: "마감" },
    { key: GAME_STATUS_FILTER.ended, label: "종료" },
  ],
} as const satisfies Record<GameTab, ReadonlyArray<{ key: GameStatusFilter; label: string }>>;

export const GAME_STATUS_FILTER_DEFAULT: GameStatusFilter = GAME_STATUS_FILTER.all;
