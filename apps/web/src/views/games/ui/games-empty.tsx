import { Button, HStack } from "@trpg/ui";
import Link from "next/link";

import { filterParams, gamesHref } from "@/features/filter-games";
import { GAME_STATUS_FILTER_DEFAULT, GAME_STATUS_FILTERS, type GamesFilter } from "@/shared/api";
import { EmptyState } from "@/shared/ui";

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
          <HStack gap="100" className="w-full [&>*]:flex-1">
            <Button asChild variant="outline" className="h-11">
              <Link href={gamesHref(filterParams({ ...filter, q: undefined }))}>검색 초기화</Link>
            </Button>
            {newGame}
          </HStack>
        }
      />
    );
  }

  const status = filter.status ?? GAME_STATUS_FILTER_DEFAULT;
  if (status !== GAME_STATUS_FILTER_DEFAULT) {
    const label = GAME_STATUS_FILTERS.find((option) => option.key === status)!.label;
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
      action={<HStack className="w-full [&>*]:flex-1">{newGame}</HStack>}
    />
  );
}
