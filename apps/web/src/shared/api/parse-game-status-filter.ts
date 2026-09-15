import {
  GAME_STATUS_FILTERS,
  GAME_STATUS_FILTER_DEFAULT,
  type GameStatusFilter,
} from "./game-sort";

export function parseGameStatusFilter(value?: string): GameStatusFilter {
  return (
    GAME_STATUS_FILTERS.find((option) => option.key === value)?.key ?? GAME_STATUS_FILTER_DEFAULT
  );
}
