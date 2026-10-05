import { HStack, Skeleton, VStack } from "@roll-and-call/ui";

import {
  GAME_STATUS_FILTER_DEFAULT,
  GAME_TAB,
  GAME_TAB_DEFAULT,
  type GamesFilter,
} from "@/shared/api";
import type { GamesCounts } from "@/shared/server";

import { statusCounts } from "../model/status-counts";
import { GameFilterButton } from "./game-filter-button";
import { GameFilterSheet } from "./game-filter-sheet";
import { GameScopeTabs } from "./game-scope-tabs";
import { GameSearchForm } from "./game-search-form";
import { GameSortSheet } from "./game-sort-sheet";
import { GameStatusChips } from "./game-status-chips";

const CHIP_SKELETON_WIDTHS = [48, 64, 88] as const;

interface GamesToolbarProps {
  filter?: GamesFilter;
  counts?: GamesCounts;
  // 탭 건수는 검색어·필터와 무관하다.
  tabCounts?: GamesCounts;
}

// 탭 줄만 AppBar 아래에 고정하고 검색·필터·칩 줄은 목록과 함께 스크롤된다(시안 05 F). top = AppBar 높이 토큰.
// Container의 px-200을 -mx-200으로 되돌려 탭 배경을 끝까지 채운다.
// 지난 구인은 끝난 날짜 최근 먼저로 고정이라 정렬 버튼이 없다. 건수가 없으면(첫 진입 뼈대) 필터 버튼만 그린다.
export function GamesToolbar({ filter = {}, counts, tabCounts }: GamesToolbarProps) {
  const tab = filter.tab ?? GAME_TAB_DEFAULT;
  const chipCounts = counts ? statusCounts({ counts, tab }) : undefined;
  return (
    <>
      <div className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) -mx-200 border-b border-gray-200 bg-surface">
        <GameScopeTabs filter={filter} counts={tabCounts} />
      </div>
      <VStack gap="125" className="py-150">
        <HStack align="center" gap="050">
          <GameSearchForm key={filter.q ?? ""} filter={filter} />
          {chipCounts ? (
            <GameFilterSheet
              filter={filter}
              count={chipCounts[filter.status ?? GAME_STATUS_FILTER_DEFAULT] ?? 0}
            />
          ) : (
            <GameFilterButton count={0} />
          )}
        </HStack>
        <HStack align="center" gap="075">
          {chipCounts ? (
            <GameStatusChips filter={filter} counts={chipCounts} />
          ) : (
            <HStack gap="075" className="min-w-0 flex-1">
              {CHIP_SKELETON_WIDTHS.map((width) => (
                <Skeleton key={width} width={width} height={32} rounded="full" />
              ))}
            </HStack>
          )}
          {tab === GAME_TAB.live && <GameSortSheet filter={filter} />}
        </HStack>
      </VStack>
    </>
  );
}
