import { GAME_TAB, type GamesFilter } from "./games-filter";

// 「지정 구인도 보기」는 지난 구인 탭에만 있다. 진행 중 탭에서는 꺼져 있어도 조건으로 치지 않는다.
export function hidesPrivateGames(filter: GamesFilter): boolean {
  return filter.tab === GAME_TAB.past && filter.includePrivate === false;
}
