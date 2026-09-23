import {
  GAME_STATUS_FILTERS,
  GAME_STATUS_FILTER_DEFAULT,
  type GameStatusFilter,
  type GameTab,
} from "./game-sort";

// 칩은 탭마다 따로라, 다른 탭의 값이 들어오면 전체로 돌린다.
export function parseGameStatusFilter({
  value,
  tab,
}: {
  value: string | undefined;
  tab: GameTab;
}): GameStatusFilter {
  return (
    GAME_STATUS_FILTERS[tab].find((option) => option.key === value)?.key ??
    GAME_STATUS_FILTER_DEFAULT
  );
}
