import { HStack, Skeleton, VStack } from "@roll-and-call/ui";

import { GameScopeTabs, GameSearchForm, GameStatusChips } from "@/features/filter-games";
import { GAME_TAB_DEFAULT, type GamesFilter } from "@/shared/api";
import type { GamesCounts } from "@/shared/server";

import { statusCounts } from "../model/status-counts";

const CHIP_SKELETON_WIDTHS = [48, 64, 88] as const;

interface GamesToolbarProps {
  filter?: GamesFilter;
  counts?: GamesCounts;
  // 탭 건수는 검색어와 무관하다.
  tabCounts?: GamesCounts;
}

// top = AppBar 높이 토큰. Container의 px-200을 -mx-200으로 되돌려 배경을 끝까지 채운다.
export function GamesToolbar({ filter = {}, counts, tabCounts }: GamesToolbarProps) {
  return (
    <VStack className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) -mx-200 border-b border-gray-200 bg-surface">
      <GameScopeTabs filter={filter} counts={tabCounts} />
      <VStack gap="125" className="px-200 py-150">
        <GameSearchForm filter={filter} />
        {counts ? (
          <GameStatusChips
            filter={filter}
            counts={statusCounts({ counts, tab: filter.tab ?? GAME_TAB_DEFAULT })}
          />
        ) : (
          <HStack gap="075">
            {CHIP_SKELETON_WIDTHS.map((width) => (
              <Skeleton key={width} width={width} height={32} rounded="full" />
            ))}
          </HStack>
        )}
      </VStack>
    </VStack>
  );
}
