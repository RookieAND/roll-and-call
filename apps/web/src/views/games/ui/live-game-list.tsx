import { Button, Pagination, VStack, cn } from "@roll-and-call/ui";
import Link from "next/link";

import { GameCard } from "@/entities/game";
import { serverPath } from "@/shared/lib";
import { getCurrentServer } from "@/shared/server";
import { ServerLink } from "@/shared/ui";

import { filterParams } from "../lib/filter-params";
import { LIVE_GRID_CLASS } from "../lib/games-desktop-class";
import { gamesHref } from "../lib/games-href";
import { type GamesFilter } from "../model/game-sort";
import type { GamesPage } from "../model/games-page";

interface LiveGameListProps {
  gamesPage: GamesPage;
  page: number;
  filter: GamesFilter;
}

// rows는 처음부터 page쪽까지다. 데스크톱은 전부 보이고 [구인 더 보기]로 늘리며, 모바일은 마지막 쪽만 보이고 쪽 번호로 넘긴다.
export async function LiveGameList({ gamesPage, page, filter }: LiveGameListProps) {
  const server = await getCurrentServer();
  const { rows, total, pageSize } = gamesPage;
  const firstOfPage = (page - 1) * pageSize;
  return (
    <>
      <VStack className={cn("gap-125", LIVE_GRID_CLASS)}>
        {rows.map((game, index) => (
          <Link
            key={game.id}
            prefetch={false}
            href={serverPath({ slug: server.slug, path: `/games/${game.id}` })}
            className={cn(
              "block h-full rounded-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tinted-ink",
              index < firstOfPage && "hidden desktop:block",
            )}
          >
            <GameCard game={game} />
          </Link>
        ))}
        {rows.length < total && (
          <Button
            render={
              <ServerLink
                path={gamesHref(filterParams({ ...filter, page: page + 1 }))}
                scroll={false}
              />
            }
            variant="ghost"
            className="hidden w-full desktop:col-span-full desktop:flex"
          >
            구인 더 보기
          </Button>
        )}
      </VStack>
      <Pagination
        page={page}
        totalPages={Math.ceil(total / pageSize)}
        className="desktop:hidden"
        renderLink={(href) => <Link href={href} prefetch={false} />}
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
