"use client";

import { Tabs, cn } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";

import { useServerPath } from "@/shared/lib";
import { FRAME_INNER_PX, TabCount } from "@/shared/ui";

import { filterParams } from "../lib/filter-params";
import { gamesHref } from "../lib/games-href";
import { GAME_TAB, GAME_TAB_DEFAULT, type GamesFilter, type GameTab } from "../model/game-sort";
import { isGameTab } from "../model/is-game-tab";

interface GameScopeTabsProps {
  filter: GamesFilter;
  counts?: Record<GameTab, number>;
}

export function GameScopeTabs({ filter, counts }: GameScopeTabsProps) {
  const toServerPath = useServerPath();
  const router = useRouter();

  return (
    <Tabs.Root
      value={filter.tab ?? GAME_TAB_DEFAULT}
      onValueChange={(tab) => {
        if (!isGameTab(tab)) return;
        router.push(
          toServerPath(
            gamesHref(
              filterParams({
                q: filter.q,
                rules: filter.rules,
                days: filter.days,
                times: filter.times,
                includeUnscheduled: filter.includeUnscheduled,
                tab,
              }),
            ),
          ),
        );
      }}
    >
      <Tabs.List aria-label="구인 범위" scrollable={false} className={cn("w-full", FRAME_INNER_PX)}>
        <Tabs.Trigger value={GAME_TAB.live} className="flex-1 desktop:flex-none">
          진행 중<TabCount count={counts?.live} />
        </Tabs.Trigger>
        <Tabs.Trigger value={GAME_TAB.past} className="flex-1 desktop:flex-none">
          지난 구인
          <TabCount count={counts?.past} />
        </Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
    </Tabs.Root>
  );
}
