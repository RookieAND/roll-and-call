import { Chip, HStack } from "@roll-and-call/ui";

import {
  GAME_STATUS_FILTERS,
  GAME_STATUS_FILTER_DEFAULT,
  GAME_TAB_DEFAULT,
  type GamesFilter,
  type GameStatusFilter,
} from "@/shared/api";
import { TabCount, ServerLink } from "@/shared/ui";

import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";

interface GameStatusChipsProps {
  filter: GamesFilter;
  counts: Partial<Record<GameStatusFilter, number>>;
}

// 칩은 32px로 보이고 위아래 6px 투명 영역으로 44px을 눌리게 한다. 가로 스크롤이 그 영역을 자르지 않게 줄에 같은 만큼 여백을 둔다.
export function GameStatusChips({ filter, counts }: GameStatusChipsProps) {
  const current = filter.status ?? GAME_STATUS_FILTER_DEFAULT;

  return (
    <HStack
      gap="075"
      render={<nav aria-label="모집 상태" />}
      className="-my-075 min-w-0 flex-1 overflow-x-auto py-075 [scrollbar-width:none]"
    >
      {GAME_STATUS_FILTERS[filter.tab ?? GAME_TAB_DEFAULT].map((option) => {
        const selected = option.key === current;
        return (
          <Chip
            key={option.key}
            render={
              <ServerLink
                path={gamesHref(filterParams({ ...filter, status: option.key, page: undefined }))}
                aria-current={selected ? "page" : undefined}
              />
            }
            selected={selected}
            className="relative after:absolute after:inset-x-0 after:-inset-y-075"
          >
            {option.label}
            <TabCount count={counts[option.key]} />
          </Chip>
        );
      })}
    </HStack>
  );
}
