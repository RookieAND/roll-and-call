import { GAME_TAB, GAME_TAB_DEFAULT, type GameTab } from "./game-sort";

export function parseGameTab(value?: string): GameTab {
  return value === GAME_TAB.past ? GAME_TAB.past : GAME_TAB_DEFAULT;
}
