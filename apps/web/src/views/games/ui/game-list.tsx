import Link from "next/link";
import { Pagination, Text, VStack } from "@trpg/ui";
import { GameCard } from "@/entities/game";
import { getRecruitingGamesPage } from "@/shared/server";
import type { GamesFilter } from "@/shared/api";
import { filterParams, gamesHref } from "@/features/filter-games";
import { GamesEmpty } from "./games-empty";

type GamesPage = Awaited<ReturnType<typeof getRecruitingGamesPage>>;

// sticky 헤더의 총 건수. GameList와 같은 조회 프로미스를 await 하므로 쿼리는 한 번만 돈다.
// 검색어가 있으면 "검색 결과 n건"으로 무엇을 센 숫자인지 말한다.
export async function GamesCount({
  promise,
  searching,
}: {
  promise: Promise<GamesPage>;
  searching: boolean;
}) {
  const { total } = await promise;
  const label = searching ? `검색 결과 ${total}건` : `${total}건`;
  return (
    <Text typography="body2" foreground="muted">
      {label}
    </Text>
  );
}

// 스트리밍 대상: 카드·페이지네이션. 검색/칩/건수/정렬 shell은 GameBoard가 sticky로 렌더한다.
export async function GameList({
  promise,
  page,
  filter,
}: {
  promise: Promise<GamesPage>;
  page: number;
  filter: GamesFilter;
}) {
  const { rows, total, pageSize } = await promise;
  const totalPages = Math.ceil(total / pageSize);

  if (rows.length === 0) {
    return <GamesEmpty filter={filter} />;
  }

  return (
    <>
      <VStack className="gap-2.5">
        {rows.map((game) => (
          <Link key={game.id} href={`/games/${game.id}`} className="block h-full">
            <GameCard game={game} />
          </Link>
        ))}
      </VStack>
      <Pagination
        page={page}
        totalPages={totalPages}
        hrefFor={(p) => gamesHref(filterParams({ ...filter, page: p }))}
      />
    </>
  );
}
