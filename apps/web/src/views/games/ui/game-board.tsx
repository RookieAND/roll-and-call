import { Suspense } from "react";
import { Container, VStack } from "@trpg/ui";
import { getRecruitingGamesPage } from "@/shared/server";
import type { GamesFilter } from "@/shared/api";
import { GameList, GamesCount } from "./game-list";
import { GameListSkeleton } from "./game-list-skeleton";
import { GamesToolbar, gamesCountSkeleton } from "./games-toolbar";

// 검색·상태 칩·건수·정렬은 스크롤 중에도 고정되고, 카드 목록만 아래로 흐른다.
// 하나의 조회 프로미스를 건수와 목록이 공유해, sticky 건수 때문에 쿼리가 두 번 돌지 않게 한다.
export function GameBoard({ page = 1, filter }: { page?: number; filter: GamesFilter }) {
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

      <VStack gap={4} className="pt-3 pb-4">
        <Suspense key={key} fallback={<GameListSkeleton />}>
          <GameList promise={gamesPage} page={page} filter={filter} />
        </Suspense>
      </VStack>
    </Container>
  );
}
