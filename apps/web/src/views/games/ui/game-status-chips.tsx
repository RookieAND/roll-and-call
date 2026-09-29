import { Chip, HStack } from "@roll-and-call/ui";
import Link from "next/link";

import {
  GAME_STATUS_FILTERS,
  GAME_STATUS_FILTER_DEFAULT,
  GAME_TAB_DEFAULT,
  type GamesFilter,
  type GameStatusFilter,
} from "@/shared/api";
import { TabCount } from "@/shared/ui";

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
      className="-mx-200 overflow-x-auto px-200 [scrollbar-width:none]"
    >
      {GAME_STATUS_FILTERS[filter.tab ?? GAME_TAB_DEFAULT].map((option) => {
        const selected = option.key === current;
        return (
          <Chip
            key={option.key}
            render={
              <Link
                href={gamesHref(filterParams({ ...filter, status: option.key, page: undefined }))}
                aria-current={selected ? "page" : undefined}
              />
            }
            selected={selected}
          >
            {option.label}
            <TabCount count={counts[option.key]} />
          </Chip>
        );
      })}
    </HStack>
  );
}
