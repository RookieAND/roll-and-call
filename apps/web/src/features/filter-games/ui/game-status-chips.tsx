import { Chip } from "@trpg/ui";
import Link from "next/link";
import { GAME_STATUS_FILTERS, GAME_STATUS_FILTER_DEFAULT, type GamesFilter } from "@/shared/api";
import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";

// 모집 상태 필터 칩 한 줄. 하나만 선택되고(?status=), 정렬·검색어와 독립이다. 바꾸면 1페이지로.
export function GameStatusChips({ filter }: { filter: GamesFilter }) {
  const current = filter.status ?? GAME_STATUS_FILTER_DEFAULT;

  return (
    <nav aria-label="모집 상태" className="-mx-4 flex gap-1.5 overflow-x-auto px-4">
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
