import { Pagination, VStack } from "@trpg/ui";
import Link from "next/link";

import { GameCard } from "@/entities/game";
import { filterParams, gamesHref } from "@/features/filter-games";
import type { GamesFilter } from "@/shared/api";
import type { getRecruitingGamesPage } from "@/shared/server";

import { GamesEmpty } from "./games-empty";

type GamesPage = Awaited<ReturnType<typeof getRecruitingGamesPage>>;

export async function GameList({
  promise,
  page,
  filter,
}: {
  promise: Promise<GamesPage>;
  page: number;
  filter: GamesFilter;
}) {
  const { rows, total, pageSize } = await promise;
  const totalPages = Math.ceil(total / pageSize);

  if (rows.length === 0) {
    return <GamesEmpty filter={filter} />;
  }

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
        totalPages={totalPages}
        hrefFor={(pageNumber) => gamesHref(filterParams({ ...filter, page: pageNumber }))}
      />
    </>
  );
}
