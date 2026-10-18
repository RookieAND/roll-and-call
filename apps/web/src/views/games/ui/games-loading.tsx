"use client";

import { useSearchParams } from "next/navigation";

import { PageShell, ServerSwitcher } from "@/shared/ui";

import { GAME_TAB } from "../model/game-sort";
import { parseGameTab } from "../model/parse-game-tab";
import { GameListSkeleton } from "./game-list-skeleton";
import { GamesAppBarFrame } from "./games-app-bar-frame";
import { GamesFilterPanelSkeleton } from "./games-filter-panel-skeleton";
import { GamesLayout } from "./games-layout";
import { GamesToolbar } from "./games-toolbar";
import { PastGameListSkeleton } from "./past-game-list-skeleton";

export function GamesLoading() {
  const tab = parseGameTab(useSearchParams().get("tab") ?? undefined);
  return (
    <PageShell
      appBar={<GamesAppBarFrame sanction={null} serverSwitch={<ServerSwitcher />} />}
      bare
      stickyAppBar
    >
      <GamesLayout
        toolbar={<GamesToolbar filter={{ tab }} />}
        panel={<GamesFilterPanelSkeleton />}
        list={tab === GAME_TAB.past ? <PastGameListSkeleton /> : <GameListSkeleton />}
      />
    </PageShell>
  );
}
