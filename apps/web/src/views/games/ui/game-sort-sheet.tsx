"use client";

import { Sheet, Text, cn } from "@roll-and-call/ui";
import { Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import {
  GAME_SORT,
  GAME_SORTS,
  type GameSort,
  type GamesFilter,
  parseGameSort,
} from "@/shared/api";
import { useServerPath } from "@/shared/lib";

import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";

interface GameSortSheetProps {
  filter: GamesFilter;
}

// 칩 줄 높이를 늘리지 않도록 음수 여백으로 44px 터치 영역만 넓힌다.
export function GameSortSheet({ filter }: GameSortSheetProps) {
  const toServerPath = useServerPath();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const current = parseGameSort(filter.sort);
  const currentLabel = GAME_SORTS.find((option) => option.key === current)!.label;

  function select(sort: GameSort) {
    setOpen(false);
    if (sort !== current)
      router.push(toServerPath(gamesHref(filterParams({ ...filter, sort, page: undefined }))));
  }

  return (
    <Sheet.Root open={open} onOpenChange={setOpen}>
      <Sheet.Trigger
        aria-label={`정렬: ${currentLabel}`}
        className="-my-075 -mr-075 flex h-11 flex-none items-center gap-025 rounded-300 pr-075 pl-125 text-subtitle2 font-bold text-gray-600 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none"
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
              <Fragment key={option.key}>
                <Sheet.Item
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
                {option.key === GAME_SORT.slots && (
                  <Text typography="body4" foreground="hint" className="px-150 pb-075">
                    추첨 구인은 맨 뒤에 보입니다
                  </Text>
                )}
              </Fragment>
            );
          })}
        </div>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
