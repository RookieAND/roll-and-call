import type { GamesFilter } from "@/shared/api";
import { PageShell } from "@/shared/ui";

import { GameBoard } from "./game-board";
import { GamesAppBar } from "./games-app-bar";

interface GamesViewProps {
  page?: number;
  filter: GamesFilter;
}

export function GamesView({ page, filter }: GamesViewProps) {
  return (
    <PageShell appBar={<GamesAppBar />} bare stickyAppBar>
      <GameBoard page={page} filter={filter} />
    </PageShell>
  );
}
