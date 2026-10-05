import { Chip, HStack } from "@roll-and-call/ui";

import {
  GAME_STATUS_FILTERS,
  GAME_STATUS_FILTER_DEFAULT,
  GAME_TAB_DEFAULT,
  type GamesFilter,
  type GameStatusFilter,
} from "@/shared/api";
import { TabCount, ServerLink } from "@/shared/ui";

import { CHIP_HIT_AREA } from "../lib/chip-hit-area";
import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";

interface GameStatusChipsProps {
  filter: GamesFilter;
  counts: Partial<Record<GameStatusFilter, number>>;
}

export function GameStatusChips({ filter, counts }: GameStatusChipsProps) {
  const current = filter.status ?? GAME_STATUS_FILTER_DEFAULT;

  return (
    <HStack
      gap="075"
      render={<nav aria-label="모집 상태" />}
      className="-my-075 min-w-0 flex-1 overflow-x-auto py-075 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
            className={CHIP_HIT_AREA}
          >
            {option.label}
            <TabCount count={counts[option.key]} />
          </Chip>
        );
      })}
    </HStack>
  );
}
