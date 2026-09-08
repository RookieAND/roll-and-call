"use client";

import { Button, Text } from "@trpg/ui";
import { Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GAME_SORT_DEFAULT, GAME_SORTS, type GameSort, parseGameSort } from "@/shared/api";
import { Sheet } from "@/shared/ui";
import { gamesHref } from "../lib/games-href";
type Props = { q?: string; sort?: string };

export function GamesFilterSheet({ q, sort }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const current = parseGameSort(sort);
  const [so, setSo] = useState<GameSort>(current);

  const currentLabel = GAME_SORTS.find((o) => o.key === current)!.label;

  function apply() {
    router.push(gamesHref({ q, sort: so === GAME_SORT_DEFAULT ? undefined : so }));
    setOpen(false);
  }

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          setSo(current);
          setOpen(true);
        }}
        className="h-auto shrink-0 gap-0.5 px-0 text-xs text-gray-700 hover:bg-transparent"
      >
        {currentLabel}
        <ChevronDown size={14} aria-hidden />
      </Button>

      <Sheet.Root open={open} onOpenChange={setOpen}>
        <Sheet.Content>
          <Sheet.Title className="mb-2 text-base font-bold text-gray-900">정렬</Sheet.Title>
          {/* ponytail: single-select list w/ dividers + check — not a Chip/segment look, hand-rolled rows */}
          <div className="divide-y divide-gray-100">
            {GAME_SORTS.map((o) => {
              const selected = so === o.key;
              return (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => setSo(o.key)}
                  className="flex min-h-12 w-full items-center justify-between text-left"
                >
                  <Text typography={selected ? "subtitle1" : "body2"} render={<span />}>
                    {o.label}
                  </Text>
                  {selected && <Check size={16} className="text-primary-600" aria-hidden />}
                </button>
              );
            })}
          </div>
          <Button className="mt-4 w-full" onClick={apply}>
            적용하기
          </Button>
        </Sheet.Content>
      </Sheet.Root>
    </>
  );
}
