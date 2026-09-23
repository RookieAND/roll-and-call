"use client";

import { Select } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

import { GAME_SORTS, type GameSort, type GamesFilter, parseGameSort } from "@/shared/api";

import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";

const SORT_ITEMS = GAME_SORTS.map((option) => ({ value: option.key, label: option.label }));

interface GameSortSelectProps {
  filter: GamesFilter;
}

export function GameSortSelect({ filter }: GameSortSelectProps) {
  const router = useRouter();
  const current = parseGameSort(filter.sort);

  return (
    <Select.Root
      value={current}
      onValueChange={(value) => {
        router.push(gamesHref(filterParams({ ...filter, sort: value as GameSort })));
      }}
      items={SORT_ITEMS}
    >
      <Select.Trigger className="h-(--rc-size-control-sm) w-auto shrink-0 border-none bg-transparent px-100 text-body3 text-gray-700" />
      <Select.Popup>
        {SORT_ITEMS.map((item) => (
          <Select.Item key={item.value} value={item.value}>
            {item.label}
          </Select.Item>
        ))}
      </Select.Popup>
    </Select.Root>
  );
}
