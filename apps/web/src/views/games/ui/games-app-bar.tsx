import { Plus } from "lucide-react";

import { toMyRulebooks } from "@/entities/rulebook";
import { getCurrentSessionUser, getRulebookRecords, getCurrentServer } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { newGameGate } from "../model/new-game-gate";
import { NewGameButton } from "./new-game-button";

export async function GamesAppBar() {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  const gate = user
    ? newGameGate(toMyRulebooks(await getRulebookRecords({ serverId: server.id, userId: user.id })))
    : null;
  return (
    <AppBar
      title="구인 목록"
      brand
      action={
        <NewGameButton
          gate={gate}
          size="sm"
          className="h-8 rounded-400 px-175 text-body3 font-bold"
        >
          <Plus size={16} strokeWidth={2.5} aria-hidden />새 구인
        </NewGameButton>
      }
    />
  );
}
