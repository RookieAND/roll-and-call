import { Skeleton } from "@trpg/ui";
import type { ReactNode } from "react";

import { GameSearchForm, GamesFilterSheet, GameStatusChips } from "@/features/filter-games";
import type { GamesFilter } from "@/shared/api";

// 건수 자리 셰이머. GamesCount(body2, 14px × 1.5 = 21px)와 높이를 맞춘다.
export const gamesCountSkeleton = <Skeleton className="h-[21px] w-16" />;

// top-[52px] = AppBar 높이. Container의 px-4를 -mx-4로 되돌려 배경을 끝까지 채운다.
export function GamesToolbar({
  filter = {},
  count = gamesCountSkeleton,
}: {
  filter?: GamesFilter;
  count?: ReactNode;
}) {
  return (
    <div className="sticky top-[52px] z-10 -mx-4 flex flex-col gap-2.5 bg-surface px-4 pt-4 pb-1">
      <GameSearchForm filter={filter} />
      <GameStatusChips filter={filter} />
      <div className="flex min-h-10 items-center justify-between">
        {count}
        <GamesFilterSheet filter={filter} />
      </div>
    </div>
  );
}
