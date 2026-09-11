import type { GamesFilter } from "@/shared/api";
import { GameBoard } from "./game-board";
import { GamesAppBar } from "./games-app-bar";

type Props = {
  page?: number;
  q?: string;
  sort?: GamesFilter["sort"];
};

export function GamesView({ page, q, sort }: Props) {
  return (
    <>
      <GamesAppBar />
      <GameBoard page={page} q={q} sort={sort} />
    </>
  );
}
