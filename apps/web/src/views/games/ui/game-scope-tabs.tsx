"use client";

import { Tabs } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

import { GAME_TAB, GAME_TAB_DEFAULT, type GamesFilter, type GameTab } from "@/shared/api";
import { TabCount } from "@/shared/ui";

import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";

interface GameScopeTabsProps {
  filter: GamesFilter;
  counts?: Record<GameTab, number>;
}

// 탭을 바꾸면 칩·정렬·쪽은 처음으로 돌아가고 검색어만 남는다.
export function GameScopeTabs({ filter, counts }: GameScopeTabsProps) {
  const router = useRouter();

  return (
    <Tabs.Root
      value={filter.tab ?? GAME_TAB_DEFAULT}
      onValueChange={(tab) =>
        router.push(gamesHref(filterParams({ q: filter.q, tab: tab as GameTab })))
      }
    >
      <Tabs.List aria-label="구인 범위" scrollable={false} className="w-full">
        <Tabs.Trigger value={GAME_TAB.live} className="flex-1">
          진행 중<TabCount count={counts?.live} />
        </Tabs.Trigger>
        <Tabs.Trigger value={GAME_TAB.past} className="flex-1">
          지난 구인
          <TabCount count={counts?.past} />
        </Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
    </Tabs.Root>
  );
}
