import Link from "next/link";
import { Button } from "@trpg/ui";
import type { GamesFilter } from "@/entities/game/api/queries";
import { AppBar } from "@/shared/ui/app-bar";
import { GameBoard } from "@/widgets/game-board";

type Props = {
  page?: number;
  q?: string;
  sort?: GamesFilter["sort"];
};

export function GamesView({ page, q, sort }: Props) {
  return (
    <>
      <AppBar
        title="구인 목록"
        action={
          <Button asChild size="sm">
            <Link href="/games/new">새 구인</Link>
          </Button>
        }
      />
      <GameBoard page={page} q={q} sort={sort} />
    </>
  );
}
