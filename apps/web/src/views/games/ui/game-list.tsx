import { GAME_TAB, type GamesFilter } from "@/shared/api";

import { loadNewGameSanction } from "../api/load-new-game-sanction";
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
  if (gamesPage.rows.length === 0) {
    const sanction = await loadNewGameSanction();
    return <GamesEmpty filter={filter} total={gamesPage.total} sanction={sanction} />;
  }
  if (filter.tab === GAME_TAB.past) {
    return <PastGameList gamesPage={gamesPage} page={page} filter={filter} />;
  }
  return <LiveGameList gamesPage={gamesPage} page={page} filter={filter} />;
}
