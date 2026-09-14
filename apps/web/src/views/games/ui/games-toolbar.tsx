import { Skeleton } from "@trpg/ui";
import type { ReactNode } from "react";
import type { GamesFilter } from "@/shared/api";
import { GameSearchForm, GamesFilterSheet } from "@/features/filter-games";

// 건수 자리 셰이머. GamesCount(body2, 14px × 1.5 = 21px)와 높이를 맞춘다.
export const gamesCountSkeleton = <Skeleton className="h-[21px] w-16" />;

// 검색·건수·정렬 sticky 셸(sticky top = AppBar 높이). 목록 화면과 로딩 폴백이 같은 셸을 써서
// 입력창 너비·행 높이가 전환 중에 흔들리지 않는다. Container의 px-4를 -mx-4로 되돌려 배경을 끝까지 채운다.
export function GamesToolbar({
  q,
  sort,
  count = gamesCountSkeleton,
}: {
  q?: string;
  sort?: GamesFilter["sort"];
  count?: ReactNode;
}) {
  return (
    <div className="sticky top-[52px] z-10 -mx-4 flex flex-col gap-3 bg-surface px-4 pt-4 pb-2">
      <GameSearchForm q={q} sort={sort} />
      <div className="flex items-center justify-between">
        {count}
        <GamesFilterSheet q={q} sort={sort} />
      </div>
    </div>
  );
}
