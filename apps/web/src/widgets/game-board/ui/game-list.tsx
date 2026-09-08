import Link from "next/link";
import { Pagination, Text, VStack } from "@trpg/ui";
import { GameCard } from "@/entities/game";
import { getRecruitingGamesPage } from "@/shared/server";
import type { GamesFilter } from "@/shared/api";
import { gamesHref } from "@/features/filter-games";
import { GamesEmpty } from "./games-empty";

type GamesPage = Awaited<ReturnType<typeof getRecruitingGamesPage>>;

// sticky 헤더의 총 건수. GameList와 같은 조회 프로미스를 await 하므로 쿼리는 한 번만 돈다.
export async function GamesCount({ promise }: { promise: Promise<GamesPage> }) {
  const { total } = await promise;
  return (
    <Text typography="body2" foreground="muted">
      전체 {total}건
    </Text>
  );
}

type Props = {
  promise: Promise<GamesPage>;
  page: number;
  q?: string;
  sort?: GamesFilter["sort"];
};

// 스트리밍 대상: 카드·페이지네이션. 검색/건수/정렬 shell은 GameBoard가 sticky로 렌더한다.
export async function GameList({ promise, page, q, sort }: Props) {
  const { rows, total, pageSize } = await promise;
  const totalPages = Math.ceil(total / pageSize);

  if (rows.length === 0) {
    return <GamesEmpty />;
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
        hrefFor={(p) => gamesHref({ q, sort, page: p })}
      />
      {totalPages > 1 && (
        <Text typography="body4" foreground="muted" className="text-center">
          {page}/{totalPages} 페이지 · {pageSize}개씩
        </Text>
      )}
    </>
  );
}
