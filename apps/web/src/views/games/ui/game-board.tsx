import { Container, VStack } from "@roll-and-call/ui";
import { Suspense } from "react";

import {
  GAME_STATUS_FILTER_DEFAULT,
  GAME_TAB,
  GAME_TAB_DEFAULT,
  hasGameFilters,
  type GamesFilter,
} from "@/shared/api";
import { getGamesCounts, getRecruitingGamesPage, getCurrentServer } from "@/shared/server";

import { filterParams } from "../lib/filter-params";
import { statusCounts } from "../model/status-counts";
import { CrossTabHint } from "./cross-tab-hint";
import { GameList } from "./game-list";
import { GameListSkeleton } from "./game-list-skeleton";
import { GamesJoinCallout } from "./games-join-callout";
import { GamesResultRow } from "./games-result-row";
import { GamesToolbar } from "./games-toolbar";
import { PastGameListSkeleton } from "./past-game-list-skeleton";

interface GameBoardProps {
  page?: number;
  filter: GamesFilter;
}

export async function GameBoard({ page = 1, filter }: GameBoardProps) {
  const server = await getCurrentServer();
  const gamesPage = getRecruitingGamesPage({ serverId: server.id, page, filter });
  const [counts, allCounts] = await Promise.all([
    getGamesCounts({ serverId: server.id, q: filter.q, filter }),
    filter.q || hasGameFilters(filter)
      ? getGamesCounts({ serverId: server.id, q: undefined })
      : null,
  ]);
  const tab = filter.tab ?? GAME_TAB_DEFAULT;
  const count = statusCounts({ counts, tab })[filter.status ?? GAME_STATUS_FILTER_DEFAULT];
  const listSkeleton = tab === GAME_TAB.past ? <PastGameListSkeleton /> : <GameListSkeleton />;
  const key = JSON.stringify(filterParams({ ...filter, page }));

  return (
    <Container>
      <GamesJoinCallout page={page} filter={filter} />
      <GamesToolbar filter={filter} counts={counts} tabCounts={allCounts ?? counts} />
      <VStack gap="150" className="pt-150 pb-200">
        <GamesResultRow filter={filter} count={count} />
        <Suspense key={key} fallback={listSkeleton}>
          <GameList promise={gamesPage} page={page} filter={filter} />
        </Suspense>
        <CrossTabHint
          filter={filter}
          otherCount={tab === GAME_TAB.past ? counts.live : counts.past}
        />
      </VStack>
    </Container>
  );
}
