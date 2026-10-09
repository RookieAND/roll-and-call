"use client";

import { Container, VStack } from "@roll-and-call/ui";
import { useSearchParams } from "next/navigation";

import { GAME_TAB, parseGameTab } from "@/shared/api";

import { GameListSkeleton } from "./game-list-skeleton";
import { GamesAppBarFrame } from "./games-app-bar-frame";
import { GamesToolbar } from "./games-toolbar";
import { PastGameListSkeleton } from "./past-game-list-skeleton";

export function GamesLoading() {
  const tab = parseGameTab(useSearchParams().get("tab") ?? undefined);
  return (
    <>
      <GamesAppBarFrame sanction={null} />
      <Container>
        <GamesToolbar filter={{ tab }} />
        <VStack gap="150" className="pt-150 pb-200">
          {tab === GAME_TAB.past ? <PastGameListSkeleton /> : <GameListSkeleton />}
        </VStack>
      </Container>
    </>
  );
}
