import Image from "next/image";
import Link from "next/link";
import { Button, Pagination, Text, VStack } from "@trpg/ui";
import { GameCard } from "@/entities/game";
import { getGamesPage, type GamesFilter } from "@/entities/game/api/queries";
import { gamesHref } from "../lib/games-href";

type GamesPage = Awaited<ReturnType<typeof getGamesPage>>;

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
    return (
      <VStack gap={4} className="items-center px-5 pt-[76px] pb-[90px] text-center">
        <Image
          src="/empty-states/empty-search.png"
          alt="조건에 맞는 구인이 없습니다"
          width={140}
          height={140}
        />
        <div>
          <Text typography="heading3" className="block">
            조건에 맞는 구인이 없습니다
          </Text>
          <Text typography="body2" foreground="muted" className="mt-1 block">
            검색어를 바꾸거나
            <br />
            직접 구인을 올려보세요.
          </Text>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/games">검색 초기화</Link>
          </Button>
          <Button asChild>
            <Link href="/games/new">새 구인 등록</Link>
          </Button>
        </div>
      </VStack>
    );
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
