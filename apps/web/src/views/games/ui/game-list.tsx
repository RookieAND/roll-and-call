import { GAME_TAB, type GamesFilter } from "@/shared/api";

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
  if (gamesPage.rows.length === 0) return <GamesEmpty filter={filter} />;
  if (filter.tab === GAME_TAB.past) {
    return <PastGameList gamesPage={gamesPage} page={page} filter={filter} />;
  }
  return <LiveGameList gamesPage={gamesPage} page={page} filter={filter} />;
}
