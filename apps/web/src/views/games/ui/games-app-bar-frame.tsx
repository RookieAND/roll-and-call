import { Plus } from "lucide-react";
import type { ReactNode } from "react";

import { AppBar } from "@/shared/ui";

import type { NewGameSanction } from "../model/new-game-sanction";
import { NewGameButton } from "./new-game-button";

interface GamesAppBarFrameProps {
  sanction: NewGameSanction | null;
  serverSwitch: ReactNode;
}

export function GamesAppBarFrame({ sanction, serverSwitch }: GamesAppBarFrameProps) {
  return (
    <AppBar
      title="구인 목록"
      brand
      serverSwitch={serverSwitch}
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
