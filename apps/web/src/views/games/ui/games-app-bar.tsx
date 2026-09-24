import { Plus } from "lucide-react";

import { toMyRulebooks } from "@/entities/rulebook";
import { NewGameButton, newGameGate } from "@/features/start-game";
import { getCurrentSessionUser, getRulebookRecords } from "@/shared/server";
import { AppBar } from "@/shared/ui";

export async function GamesAppBar() {
  const user = await getCurrentSessionUser();
  const gate = user ? newGameGate(toMyRulebooks(await getRulebookRecords(user.id))) : null;
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
