import { Suspense } from "react";
import { Container, Skeleton, TextInput, VStack } from "@trpg/ui";
import { getGamesPage, type GamesFilter } from "@/entities/game/index.server";
import { GamesFilterSheet } from "@/features/filter-games";
import { GameList, GamesCount } from "./game-list";
import { GameListSkeleton } from "./game-list-skeleton";

type Props = {
  page?: number;
  q?: string;
  sort?: GamesFilter["sort"];
};

// 검색·건수·정렬은 스크롤 중에도 고정(sticky top = AppBar 높이)되고, 카드 목록만 아래로 흐른다.
// 하나의 조회 프로미스를 건수와 목록이 공유해, sticky 건수 때문에 쿼리가 두 번 돌지 않게 한다.
export function GameBoard({ page = 1, q, sort }: Props) {
  const gamesPage = getGamesPage(page, { q, sort });
  const key = `${q ?? ""}|${sort ?? ""}|${page}`;

  return (
    <Container>
      <div className="sticky top-[52px] z-10 -mx-4 flex flex-col gap-3 bg-surface px-4 pt-4 pb-2">
        <form action="/games" method="get">
          {sort && <input type="hidden" name="sort" value={sort} />}
          <TextInput name="q" defaultValue={q} placeholder="게임명 검색" />
        </form>
        <div className="flex items-center justify-between">
          <Suspense key={key} fallback={<Skeleton className="h-4 w-16" />}>
            <GamesCount promise={gamesPage} />
          </Suspense>
          <GamesFilterSheet q={q} sort={sort} />
        </div>
      </div>

      <VStack gap={4} className="pt-3 pb-4">
        <Suspense key={key} fallback={<GameListSkeleton />}>
          <GameList promise={gamesPage} page={page} q={q} sort={sort} />
        </Suspense>
      </VStack>
    </Container>
  );
}
