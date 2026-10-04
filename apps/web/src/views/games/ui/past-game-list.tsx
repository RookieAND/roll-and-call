import { Button, Text, VStack } from "@roll-and-call/ui";

import { PastGameCard } from "@/entities/game";
import type { GamesFilter } from "@/shared/api";
import { ServerLink } from "@/shared/ui";

import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";
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
    <>
      {groups.map((group) => (
        <VStack key={group.key} className="gap-125">
          <Text typography="subtitle2" render={<h2 />}>
            {group.label}
          </Text>
          {group.items.map((game) => (
            <ServerLink key={game.id} path={`/games/${game.id}`} className="block h-full">
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
          className="w-full"
        >
          지난 구인 더 보기
        </Button>
      )}
    </>
  );
}
