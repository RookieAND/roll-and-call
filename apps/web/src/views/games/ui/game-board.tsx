import { Suspense } from "react";
import { Container, VStack } from "@trpg/ui";
import { getRecruitingGamesPage } from "@/shared/server";
import type { GamesFilter } from "@/shared/api";
import { GameList, GamesCount } from "./game-list";
import { GameListSkeleton } from "./game-list-skeleton";
import { GamesToolbar, gamesCountSkeleton } from "./games-toolbar";

type Props = {
  page?: number;
  q?: string;
  sort?: GamesFilter["sort"];
};

// 검색·건수·정렬은 스크롤 중에도 고정되고, 카드 목록만 아래로 흐른다.
// 하나의 조회 프로미스를 건수와 목록이 공유해, sticky 건수 때문에 쿼리가 두 번 돌지 않게 한다.
export function GameBoard({ page = 1, q, sort }: Props) {
  const gamesPage = getRecruitingGamesPage(page, { q, sort });
  const key = `${q ?? ""}|${sort ?? ""}|${page}`;

  return (
    <Container>
      <GamesToolbar
        q={q}
        sort={sort}
        count={
          <Suspense key={key} fallback={gamesCountSkeleton}>
            <GamesCount promise={gamesPage} />
          </Suspense>
        }
      />

      <VStack gap={4} className="pt-3 pb-4">
        <Suspense key={key} fallback={<GameListSkeleton />}>
          <GameList promise={gamesPage} page={page} q={q} sort={sort} />
        </Suspense>
      </VStack>
    </Container>
  );
}
