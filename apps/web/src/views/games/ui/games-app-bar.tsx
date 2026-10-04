import { Plus } from "lucide-react";

import { AppBar } from "@/shared/ui";

import { loadNewGameSanction } from "../api/load-new-game-sanction";
import { NewGameButton } from "./new-game-button";

export async function GamesAppBar() {
  const sanction = await loadNewGameSanction();
  return (
    <AppBar
      title="구인 목록"
      brand
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
