import { Button, HStack } from "@roll-and-call/ui";
import Link from "next/link";

import { filterParams, gamesHref } from "@/features/filter-games";
import {
  GAME_STATUS_FILTER_DEFAULT,
  GAME_STATUS_FILTERS,
  GAME_TAB,
  GAME_TAB_DEFAULT,
  type GamesFilter,
} from "@/shared/api";
import { EmptyState } from "@/shared/ui";

interface GamesEmptyProps {
  filter: GamesFilter;
}

export function GamesEmpty({ filter }: GamesEmptyProps) {
  const tab = filter.tab ?? GAME_TAB_DEFAULT;
  const newGame = <Button render={<Link href="/games/new" />}>새 구인 등록</Button>;

  if (filter.q) {
    return (
      <EmptyState
        image="/empty-states/empty-search.png"
        title={`‘${filter.q}’에 맞는 구인이 없습니다`}
        description={"검색어를 바꾸거나\n직접 구인을 올려보세요."}
        action={
          <HStack gap="100" className="mt-100 w-full [&>*]:flex-1">
            <Button
              render={<Link href={gamesHref(filterParams({ ...filter, q: undefined }))} />}
              variant="outline"
            >
              검색 초기화
            </Button>
            {newGame}
          </HStack>
        }
      />
    );
  }

  const status = filter.status ?? GAME_STATUS_FILTER_DEFAULT;
  if (status !== GAME_STATUS_FILTER_DEFAULT) {
    const label = GAME_STATUS_FILTERS[tab].find((option) => option.key === status)!.label;
    return (
      <EmptyState
        image="/empty-states/empty-search.png"
        title={`‘${label}’인 구인이 없습니다`}
        action={
          <Button
            render={
              <Link
                href={gamesHref(filterParams({ ...filter, status: GAME_STATUS_FILTER_DEFAULT }))}
              />
            }
            variant="outline"
            className="mt-100"
          >
            필터 해제
          </Button>
        }
      />
    );
  }

  if (tab === GAME_TAB.past) {
    return (
      <EmptyState
        image="/empty-states/empty-my-games.png"
        title="지난 구인이 아직 없습니다"
        description="모집이 끝난 구인이 이 자리에 쌓입니다."
      />
    );
  }

  return (
    <EmptyState
      image="/empty-states/empty-my-games.png"
      title="아직 올라온 구인이 없습니다"
      description="첫 구인을 올리면 이 자리에 보입니다."
      action={<div className="mt-100">{newGame}</div>}
    />
  );
}
