import { Suspense } from "react";

import { ServerSwitcher } from "@/shared/ui";

import { loadNewGameSanction } from "../api/load-new-game-sanction";
import { GamesAppBarFrame } from "./games-app-bar-frame";
import { GamesServerSwitch } from "./games-server-switch";

export async function GamesAppBar() {
  const sanction = await loadNewGameSanction();
  return (
    <GamesAppBarFrame
      sanction={sanction}
      serverSwitch={
        <Suspense fallback={<ServerSwitcher />}>
          <GamesServerSwitch />
        </Suspense>
      }
    />
  );
}
