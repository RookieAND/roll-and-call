import Link from "next/link";
import { Button } from "@trpg/ui";
import { GAME_STATUS_FILTER_DEFAULT, GAME_STATUS_FILTERS, type GamesFilter } from "@/shared/api";
import { filterParams, gamesHref } from "@/features/filter-games";
import { EmptyState } from "@/shared/ui";

// 구인 목록 0건. 원인에 따라 문구와 다음 행동을 나눈다:
// 검색어 → 검색어를 제목에 되풀이하고 "검색 초기화" / 상태 필터 → "필터 해제" / 글 자체가 없음 → "새 구인 등록"만.
export function GamesEmpty({ filter }: { filter: GamesFilter }) {
  const newGame = (
    <Button asChild className="h-11">
      <Link href="/games/new">새 구인 등록</Link>
    </Button>
  );

  if (filter.q) {
    return (
      <EmptyState
        image="/empty-states/empty-search.png"
        title={`'${filter.q}'에 맞는 구인이 없습니다`}
        description="검색어를 바꾸거나 직접 구인을 올려보세요."
        action={
          <div className="flex w-full gap-2 [&>*]:flex-1">
            <Button asChild variant="outline" className="h-11">
              <Link href={gamesHref(filterParams({ ...filter, q: undefined }))}>검색 초기화</Link>
            </Button>
            {newGame}
          </div>
        }
      />
    );
  }

  const status = filter.status ?? GAME_STATUS_FILTER_DEFAULT;
  if (status !== GAME_STATUS_FILTER_DEFAULT) {
    const label = GAME_STATUS_FILTERS.find((o) => o.key === status)!.label;
    return (
      <EmptyState
        image="/empty-states/empty-search.png"
        title={`'${label}'인 구인이 없습니다`}
        action={
          <Button asChild variant="outline" className="h-11 w-full">
            <Link href={gamesHref(filterParams({ ...filter, status: GAME_STATUS_FILTER_DEFAULT }))}>
              필터 해제
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <EmptyState
      image="/empty-states/empty-search.png"
      title="아직 올라온 구인이 없습니다"
      description="첫 구인을 올리면 이 자리에 보입니다."
      action={<div className="flex w-full [&>*]:flex-1">{newGame}</div>}
    />
  );
}
