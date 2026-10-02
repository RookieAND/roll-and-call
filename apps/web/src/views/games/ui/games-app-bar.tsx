import { Plus } from "lucide-react";

import { toMyRulebooks } from "@/entities/rulebook";
import { getCurrentMembership, getRulebookRecords, getCurrentServer } from "@/shared/server";
import { AppBar } from "@/shared/ui";

import { newGameGate } from "../model/new-game-gate";
import { NewGameButton } from "./new-game-button";

export async function GamesAppBar() {
  // 비멤버는 게이트 없이 /games/new로 보낸다. 멤버 전용 화면이라 가입 화면을 거쳐 돌아온다.
  const [server, membership] = await Promise.all([getCurrentServer(), getCurrentMembership()]);
  const gate = membership
    ? newGameGate(
        toMyRulebooks(await getRulebookRecords({ serverId: server.id, userId: membership.userId })),
      )
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
