import { Button, Text, VStack, cn } from "@roll-and-call/ui";

import { PastGameCard } from "@/entities/game";
import { ServerLink } from "@/shared/ui";

import { filterParams } from "../lib/filter-params";
import { LIVE_GRID_CLASS } from "../lib/games-desktop-class";
import { gamesHref } from "../lib/games-href";
import { type GamesFilter } from "../model/game-sort";
import type { GamesPage } from "../model/games-page";
import { groupByMonth } from "../model/group-by-month";
import { pastFinishedAt } from "../model/past-finished-at";

interface PastGameListProps {
  gamesPage: GamesPage;
  page: number;
  filter: GamesFilter;
}

export function PastGameList({ gamesPage, page, filter }: PastGameListProps) {
  const { rows, total } = gamesPage;
  const groups = groupByMonth({
    items: rows,
    finishedAt: pastFinishedAt,
  });

  return (
    <div className={cn("flex flex-col gap-150", LIVE_GRID_CLASS)}>
      {groups.map((group) => (
        <VStack key={group.key} className="gap-125 desktop:contents">
          <Text typography="subtitle2" render={<h2 />} className="desktop:col-span-full">
            {group.label}
          </Text>
          {group.items.map((game) => (
            <ServerLink
              key={game.id}
              path={`/games/${game.id}`}
              className="block h-full rounded-600 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tinted-ink"
            >
              <PastGameCard game={game} />
            </ServerLink>
          ))}
        </VStack>
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
          className="w-full desktop:col-span-full"
        >
          지난 구인 더 보기
        </Button>
      )}
    </div>
  );
}
