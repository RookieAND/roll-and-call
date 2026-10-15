import type { GamesFilter } from "@/shared/api";
import { PageShell } from "@/shared/ui";

import { GAMES_SHELL_CLASS } from "../lib/games-desktop-class";
import { GameBoard } from "./game-board";
import { GamesAppBar } from "./games-app-bar";

interface GamesViewProps {
  page?: number;
  filter: GamesFilter;
}

export function GamesView({ page, filter }: GamesViewProps) {
  return (
    <PageShell appBar={<GamesAppBar />} className={GAMES_SHELL_CLASS} bare>
      <GameBoard page={page} filter={filter} />
    </PageShell>
  );
}
