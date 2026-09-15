"use client";

import { Button, Text } from "@trpg/ui";
import { Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { GAME_SORTS, type GameSort, type GamesFilter, parseGameSort } from "@/shared/api";
import { Sheet } from "@/shared/ui";

import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";

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
        className="-mr-3 h-10 shrink-0 gap-0.5 px-3 text-[13px] text-gray-700"
      >
        {currentLabel}
        <ChevronDown size={14} aria-hidden />
      </Button>

      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Content>
          <Sheet.Title className="mb-2 text-base font-bold text-gray-900">정렬</Sheet.Title>
          {/* ponytail: single-select list w/ dividers + check — not a Chip/segment look, hand-rolled rows */}
          <div role="radiogroup" aria-label="정렬" className="divide-y divide-gray-100">
            {GAME_SORTS.map((option) => {
              const selected = current === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => select(option.key)}
                  className="flex min-h-12 w-full items-center justify-between text-left"
                >
                  <Text typography={selected ? "subtitle1" : "body2"} render={<span />}>
                    {option.label}
                  </Text>
                  {selected && <Check size={16} className="text-primary-600" aria-hidden />}
                </button>
              );
            })}
          </div>
        </Sheet.Content>
      </Sheet.Root>
    </>
  );
}
