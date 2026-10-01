import { Pagination, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { GameCard } from "@/entities/game";
import type { GamesFilter } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getCurrentServer } from "@/shared/server";

import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";
import type { GamesPage } from "../model/games-page";

interface LiveGameListProps {
  gamesPage: GamesPage;
  page: number;
  filter: GamesFilter;
}

export async function LiveGameList({ gamesPage, page, filter }: LiveGameListProps) {
  const server = await getCurrentServer();
  const { rows, total, pageSize } = gamesPage;
  return (
    <>
      <VStack className="gap-125">
        {rows.map((game) => (
          <Link
            key={game.id}
            href={serverPath({ slug: server.slug, path: `/games/${game.id}` })}
            className="block h-full"
          >
            <GameCard game={game} />
          </Link>
        ))}
      </VStack>
      <Pagination
        page={page}
        totalPages={Math.ceil(total / pageSize)}
        hrefFor={(pageNumber) =>
          serverPath({
            slug: server.slug,
            path: gamesHref(filterParams({ ...filter, page: pageNumber })),
          })
        }
      />
    </>
  );
}
