import { loadNewGameSanction } from "../api/load-new-game-sanction";
import { GAME_TAB, type GamesFilter } from "../model/game-sort";
import type { GamesPage } from "../model/games-page";
import { GamesEmpty } from "./games-empty";
import { LiveGameList } from "./live-game-list";
import { PastGameList } from "./past-game-list";

interface GameListProps {
  promise: Promise<GamesPage>;
  page: number;
  filter: GamesFilter;
}

export async function GameList({ promise, page, filter }: GameListProps) {
  const gamesPage = await promise;
  const isPast = filter.tab === GAME_TAB.past;
  // 진행 중 탭 모바일은 마지막 쪽만 보이므로, 그 쪽이 비면 쪽 번호가 범위를 넘은 것이다.
  const lastPageRows = isPast
    ? gamesPage.rows
    : gamesPage.rows.slice((page - 1) * gamesPage.pageSize);
  if (lastPageRows.length === 0) {
    const sanction = await loadNewGameSanction();
    return <GamesEmpty filter={filter} total={gamesPage.total} sanction={sanction} />;
  }
  if (isPast) {
    return <PastGameList gamesPage={gamesPage} page={page} filter={filter} />;
  }
  return <LiveGameList gamesPage={gamesPage} page={page} filter={filter} />;
}
