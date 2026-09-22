import { Container, VStack } from "@roll-and-call/ui";
import { Suspense } from "react";

import type { GamesFilter } from "@/shared/api";
import { getRecruitingGamesPage } from "@/shared/server";

import { GameList } from "./game-list";
import { GameListSkeleton } from "./game-list-skeleton";
import { GamesCount } from "./games-count";
import { GamesToolbar, gamesCountSkeleton } from "./games-toolbar";

interface GameBoardProps {
  page?: number;
  filter: GamesFilter;
}

// 하나의 조회 프로미스를 건수와 목록이 공유해, sticky 건수 때문에 쿼리가 두 번 돌지 않게 한다.
export function GameBoard({ page = 1, filter }: GameBoardProps) {
  const gamesPage = getRecruitingGamesPage(page, filter);
  const key = `${filter.q ?? ""}|${filter.sort ?? ""}|${filter.status ?? ""}|${page}`;

  return (
    <Container>
      <GamesToolbar
        filter={filter}
        count={
          <Suspense key={key} fallback={gamesCountSkeleton}>
            <GamesCount promise={gamesPage} searching={Boolean(filter.q)} />
          </Suspense>
        }
      />

      <VStack gap="200" className="pt-150 pb-200">
        <Suspense key={key} fallback={<GameListSkeleton />}>
          <GameList promise={gamesPage} page={page} filter={filter} />
        </Suspense>
      </VStack>
    </Container>
  );
}
