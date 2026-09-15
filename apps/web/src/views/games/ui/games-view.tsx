import type { GamesFilter } from "@/shared/api";

import { GameBoard } from "./game-board";
import { GamesAppBar } from "./games-app-bar";

export function GamesView({ page, filter }: { page?: number; filter: GamesFilter }) {
  return (
    <>
      <GamesAppBar />
      <GameBoard page={page} filter={filter} />
    </>
  );
}
