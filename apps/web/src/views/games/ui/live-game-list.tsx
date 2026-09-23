import { Pagination, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { GameCard } from "@/entities/game";
import { filterParams, gamesHref } from "@/features/filter-games";
import type { GamesFilter } from "@/shared/api";

import type { GamesPage } from "../model/games-page";

interface LiveGameListProps {
  gamesPage: GamesPage;
  page: number;
  filter: GamesFilter;
}

export function LiveGameList({ gamesPage, page, filter }: LiveGameListProps) {
  const { rows, total, pageSize } = gamesPage;
  return (
    <>
      <VStack className="gap-125">
        {rows.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`} className="block h-full">
            <GameCard game={game} />
          </Link>
        ))}
      </VStack>
      <Pagination
        page={page}
        totalPages={Math.ceil(total / pageSize)}
        hrefFor={(pageNumber) => gamesHref(filterParams({ ...filter, page: pageNumber }))}
      />
    </>
  );
}
