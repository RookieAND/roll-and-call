import Link from "next/link";
import { Button, Container, Pagination, Text, TextInput, VStack } from "@trpg/ui";
import { GameCard } from "@/entities/game";
import { getGamesPage, type GamesFilter } from "@/entities/game/api/queries";
import { GamesFilterSheet, GameStatusFilter } from "@/features/game";

type Props = {
  page?: number;
  q?: string;
  status?: GamesFilter["status"];
  sort?: GamesFilter["sort"];
};

function qs(params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `/games?${s}` : "/games";
}

export async function GameBoard({ page = 1, q, status, sort }: Props) {
  const { rows, total, pageSize } = await getGamesPage(page, { q, status, sort });
  const totalPages = Math.ceil(total / pageSize);
  const isEmpty = rows.length === 0;

  return (
    <Container>
      <VStack gap={4} className="py-4">
        <form action="/games" method="get">
          {status && <input type="hidden" name="status" value={status} />}
          {sort && <input type="hidden" name="sort" value={sort} />}
          <TextInput name="q" defaultValue={q} placeholder="게임명 · 룰 검색" />
        </form>

        <GameStatusFilter
          status={status}
          hrefFor={(next) => qs({ q, sort, status: next })}
        />

        <div className="flex items-center justify-between">
          <Text size="sm" color="muted">
            전체 {total}건
          </Text>
          <GamesFilterSheet q={q} status={status} sort={sort} />
        </div>

        {isEmpty ? (
          <VStack gap={4} className="items-center px-5 pt-[76px] pb-[90px] text-center">
            <span className="h-11 w-11 rounded-[13px] bg-gray-100" />
            <div>
              <Text weight="bold" className="block">
                조건에 맞는 구인이 없습니다
              </Text>
              <Text size="sm" color="muted" className="mt-1 block">
                검색어나 필터를 바꾸거나
                <br />
                직접 구인을 올려보세요.
              </Text>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/games">필터 초기화</Link>
              </Button>
              <Button asChild>
                <Link href="/games/new">새 구인 등록</Link>
              </Button>
            </div>
          </VStack>
        ) : (
          <>
            <VStack className="gap-2.5">
              {rows.map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="block h-full"
                >
                  <GameCard game={game} />
                </Link>
              ))}
            </VStack>
            <Pagination
              page={page}
              totalPages={totalPages}
              hrefFor={(p) => qs({ q, status, sort, page: p })}
            />
            {totalPages > 1 && (
              <Text size="xs" color="muted" className="text-center">
                {page}/{totalPages} 페이지 · {pageSize}개씩
              </Text>
            )}
          </>
        )}
      </VStack>
    </Container>
  );
}
