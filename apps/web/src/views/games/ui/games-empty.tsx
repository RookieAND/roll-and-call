import { Button, HStack } from "@roll-and-call/ui";

import {
  GAME_STATUS_FILTER_DEFAULT,
  GAME_STATUS_FILTERS,
  GAME_TAB,
  GAME_TAB_DEFAULT,
  type GamesFilter,
} from "@/shared/api";
import { EmptyState, ServerLink } from "@/shared/ui";

import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";
import type { NewGameSanction } from "../model/new-game-sanction";
import { NewGameButton } from "./new-game-button";

interface GamesEmptyProps {
  filter: GamesFilter;
  // 같은 조건의 전체 건수. 1 이상인데 행이 없으면 쪽 번호가 범위를 넘은 것이다.
  total: number;
  sanction: NewGameSanction | null;
}

export function GamesEmpty({ filter, total, sanction }: GamesEmptyProps) {
  const tab = filter.tab ?? GAME_TAB_DEFAULT;
  const newGame = <NewGameButton sanction={sanction}>새 구인 등록</NewGameButton>;

  if (total > 0) {
    return (
      <EmptyState
        image="/empty-states/empty-search.png"
        title="이 쪽에는 구인이 없습니다"
        action={
          <Button
            render={<ServerLink path={gamesHref(filterParams({ ...filter, page: undefined }))} />}
            variant="outline"
            className="mt-100"
          >
            첫 쪽으로
          </Button>
        }
      />
    );
  }

  if (filter.q) {
    return (
      <EmptyState
        image="/empty-states/empty-search.png"
        title={`「${filter.q}」에 맞는 구인이 없습니다`}
        description={
          <span className="break-keep">검색어를 바꾸거나 직접 구인을 올릴 수 있습니다.</span>
        }
        action={
          <HStack gap="100" className="mt-100 w-full [&>*]:flex-1">
            <Button
              render={<ServerLink path={gamesHref(filterParams({ ...filter, q: undefined }))} />}
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
        title={`「${label}」인 구인이 없습니다`}
        action={
          <Button
            render={
              <ServerLink
                path={gamesHref(filterParams({ ...filter, status: GAME_STATUS_FILTER_DEFAULT }))}
              />
            }
            variant="outline"
            className="mt-100"
          >
            전체 보기
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
