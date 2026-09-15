import { GAME_SORTS, GAME_SORT_DEFAULT, type GameSort } from "./game-sort";

export function parseGameSort(value?: string): GameSort {
  return GAME_SORTS.find((option) => option.key === value)?.key ?? GAME_SORT_DEFAULT;
}
