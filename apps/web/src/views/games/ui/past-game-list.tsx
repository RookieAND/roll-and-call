import { Button, HStack, Text, VStack } from "@roll-and-call/ui";

import { PastGameCard, sessionEndAt } from "@/entities/game";
import type { GamesFilter } from "@/shared/api";
import { ServerLink } from "@/shared/ui";

import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";
import type { GamesPage } from "../model/games-page";
import { groupByMonth } from "../model/group-by-month";

interface PastGameListProps {
  gamesPage: GamesPage;
  page: number;
  filter: GamesFilter;
}

// 달 머리글의 건수는 지금 불러온 만큼이다(더 보기로 늘어난다).
export function PastGameList({ gamesPage, page, filter }: PastGameListProps) {
  const { rows, total } = gamesPage;
  const groups = groupByMonth({
    items: rows,
    finishedAt: (game) => sessionEndAt(game) ?? game.endDate,
  });

  return (
    <>
      {groups.map((group) => (
        <VStack key={group.key} className="gap-125">
          <HStack align="baseline" gap="075" render={<h2 />}>
            <Text typography="subtitle2" render={<span />}>
              {group.label}
            </Text>
            <Text typography="body4" foreground="hint" render={<span />}>
              {group.items.length}건
            </Text>
          </HStack>
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
