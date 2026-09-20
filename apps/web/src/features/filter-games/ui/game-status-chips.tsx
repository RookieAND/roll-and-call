import { Chip } from "@trpg/ui";
import Link from "next/link";

import { GAME_STATUS_FILTERS, GAME_STATUS_FILTER_DEFAULT, type GamesFilter } from "@/shared/api";

import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";

interface GameStatusChipsProps {
  filter: GamesFilter;
}

export function GameStatusChips({ filter }: GameStatusChipsProps) {
  const current = filter.status ?? GAME_STATUS_FILTER_DEFAULT;

  return (
    <nav aria-label="모집 상태" className="-mx-200 flex gap-075 overflow-x-auto px-200">
      {GAME_STATUS_FILTERS.map((option) => {
        const selected = option.key === current;
        return (
          <Chip key={option.key} asChild selected={selected} className="h-[34px]">
            <Link
              href={gamesHref(filterParams({ ...filter, status: option.key }))}
              aria-current={selected ? "page" : undefined}
            >
              {option.label}
            </Link>
          </Chip>
        );
      })}
    </nav>
  );
}
