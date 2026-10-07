import { Plus } from "lucide-react";
import { Suspense } from "react";

import { AppBar, ServerSwitcher } from "@/shared/ui";

import { loadNewGameSanction } from "../api/load-new-game-sanction";
import { GamesServerSwitch } from "./games-server-switch";
import { NewGameButton } from "./new-game-button";

export async function GamesAppBar() {
  const sanction = await loadNewGameSanction();
  return (
    <AppBar
      title="구인 목록"
      brand
      serverSwitch={
        <Suspense fallback={<ServerSwitcher />}>
          <GamesServerSwitch />
        </Suspense>
      }
      action={
        <NewGameButton
          sanction={sanction}
          size="sm"
          className="h-8 rounded-400 px-175 text-body3 font-bold"
        >
          <Plus size={16} strokeWidth={2.5} aria-hidden />새 구인
        </NewGameButton>
      }
    />
  );
}
