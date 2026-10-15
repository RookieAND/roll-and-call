import { Pagination, VStack, cn } from "@roll-and-call/ui";
import Link from "next/link";

import { GameCard } from "@/entities/game";
import type { GamesFilter } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import { getCurrentServer } from "@/shared/server";

import { filterParams } from "../lib/filter-params";
import { LIVE_GRID_CLASS } from "../lib/games-desktop-class";
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
      <VStack className={cn("gap-125", LIVE_GRID_CLASS)}>
        {rows.map((game) => (
          <Link
            key={game.id}
            href={serverPath({ slug: server.slug, path: `/games/${game.id}` })}
            className="block h-full rounded-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tinted-ink"
          >
            <GameCard game={game} />
          </Link>
        ))}
      </VStack>
      <Pagination
        page={page}
        totalPages={Math.ceil(total / pageSize)}
        renderLink={(href) => <Link href={href} />}
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
