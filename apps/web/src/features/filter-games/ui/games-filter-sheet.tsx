"use client";

import { Button } from "@trpg/ui";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { GAME_SORTS, type GameSort, type GamesFilter, parseGameSort } from "@/shared/api";
import { Sheet } from "@/shared/ui";

import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";
import { SelectedSortOptionRow } from "./selected-sort-option-row";
import { SortOptionRow } from "./sort-option-row";

export function GamesFilterSheet({ filter }: { filter: GamesFilter }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const current = parseGameSort(filter.sort);
  const currentLabel = GAME_SORTS.find((option) => option.key === current)!.label;

  function select(sort: GameSort) {
    setOpen(false);
    if (sort !== current) router.push(gamesHref(filterParams({ ...filter, sort })));
  }

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        aria-label={`정렬: ${currentLabel}`}
        className="-mr-150 h-10 shrink-0 gap-025 px-150 text-body3 text-gray-700"
      >
        {currentLabel}
        <ChevronDown size={14} aria-hidden />
      </Button>

      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Content>
          <Sheet.Title className="mb-100 text-base font-bold text-gray-900">정렬</Sheet.Title>
          {/* ponytail: single-select list w/ dividers + check — not a Chip/segment look, hand-rolled rows */}
          <div role="radiogroup" aria-label="정렬" className="divide-y divide-gray-100">
            {GAME_SORTS.map((option) => {
              const Row = current === option.key ? SelectedSortOptionRow : SortOptionRow;
              return (
                <Row key={option.key} label={option.label} onSelect={() => select(option.key)} />
              );
            })}
          </div>
        </Sheet.Content>
      </Sheet.Root>
    </>
  );
}
