"use client";

import { Sheet, cn } from "@roll-and-call/ui";
import { Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { GAME_SORTS, type GameSort, type GamesFilter, parseGameSort } from "@/shared/api";

import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";

interface GameSortSheetProps {
  filter: GamesFilter;
}

// 건수 줄 높이를 늘리지 않도록 음수 여백으로 44px 터치 영역만 넓힌다.
export function GameSortSheet({ filter }: GameSortSheetProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const current = parseGameSort(filter.sort);
  const currentLabel = GAME_SORTS.find((option) => option.key === current)!.label;

  function select(sort: GameSort) {
    setOpen(false);
    if (sort !== current)
      router.push(gamesHref(filterParams({ ...filter, sort, page: undefined })));
  }

  return (
    <Sheet.Root open={open} onOpenChange={setOpen}>
      <Sheet.Trigger
        aria-label={`정렬: ${currentLabel}`}
        className="-my-150 -mr-075 flex h-11 items-center gap-025 rounded-300 pr-075 pl-125 text-subtitle2 font-bold text-gray-600 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
      >
        {currentLabel}
        <ChevronDown size={14} strokeWidth={2.4} aria-hidden />
      </Sheet.Trigger>
      <Sheet.Popup>
        <Sheet.Handle />
        <Sheet.Title className="mb-100">정렬</Sheet.Title>
        <div role="radiogroup" aria-label="정렬">
          {GAME_SORTS.map((option) => {
            const selected = current === option.key;
            return (
              <Sheet.Item
                key={option.key}
                role="radio"
                aria-checked={selected}
                onClick={() => select(option.key)}
                className={cn(
                  "rounded-400 border-b-0 px-150",
                  selected && "bg-tinted-bg font-bold text-tinted-ink hover:bg-tinted-bg",
                )}
              >
                {option.label}
                {selected && <Check size={16} aria-hidden />}
              </Sheet.Item>
            );
          })}
        </div>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
