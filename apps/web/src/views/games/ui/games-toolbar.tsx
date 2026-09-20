import { HStack, Skeleton, VStack } from "@trpg/ui";
import type { ReactNode } from "react";

import { GameSearchForm, GamesFilterSheet, GameStatusChips } from "@/features/filter-games";
import type { GamesFilter } from "@/shared/api";

// 건수 자리 셰이머. GamesCount(body3, 13px × 1.6 ≈ 21px)와 높이를 맞춘다.
export const gamesCountSkeleton = <Skeleton width={64} height={21} />;

// top-[52px] = AppBar 높이. Container의 px-200을 -mx-200으로 되돌려 배경을 끝까지 채운다.
export function GamesToolbar({
  filter = {},
  count = gamesCountSkeleton,
}: {
  filter?: GamesFilter;
  count?: ReactNode;
}) {
  return (
    <VStack gap="125" className="sticky top-[52px] z-10 -mx-200 bg-surface px-200 pt-200 pb-050">
      <GameSearchForm filter={filter} />
      <GameStatusChips filter={filter} />
      <HStack align="center" justify="between" className="min-h-10">
        {count}
        <GamesFilterSheet filter={filter} />
      </HStack>
    </VStack>
  );
}
