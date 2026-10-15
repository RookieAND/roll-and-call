"use client";

import { useSearchParams } from "next/navigation";

import { GAME_TAB, parseGameTab } from "@/shared/api";
import { PageShell, ServerSwitcher } from "@/shared/ui";

import { GAMES_SHELL_CLASS } from "../lib/games-desktop-class";
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
      className={GAMES_SHELL_CLASS}
      bare
    >
      <GamesLayout
        toolbar={<GamesToolbar filter={{ tab }} />}
        panel={tab === GAME_TAB.live && <GamesFilterPanelSkeleton />}
        list={tab === GAME_TAB.past ? <PastGameListSkeleton /> : <GameListSkeleton />}
      />
    </PageShell>
  );
}
