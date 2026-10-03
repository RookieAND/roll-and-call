import "server-only";
import type { Server } from "@roll-and-call/database";
import { evaluateGameBadges } from "@roll-and-call/database/badges";
import { leaveServer } from "@roll-and-call/database/servers";
import {
  notifyGameCancelled,
  notifyGameLeft,
  refreshRecruitPost,
} from "@roll-and-call/game-notices";
import { uniq } from "es-toolkit";
import { revalidatePath } from "next/cache";

// 디스코드 서버를 나간 멤버를 정리하고 구인 스레드에 알린다. 이미 처리된 멤버면 아무것도 하지 않는다.
// 화면을 그리는 중에는 revalidatePath를 못 부르므로, 렌더 중인 곳에서는 after() 안에서 부른다.
export async function handleMemberLeft({ server, userId }: { server: Server; userId: string }) {
  const result = await leaveServer({ serverId: server.id, userId });
  if (!result.ok) return false;

  for (const gameId of result.leftConfirmedGameIds) {
    await notifyGameLeft({ server, gameId, userId, removedByGm: false, leftServer: true });
  }
  for (const gameId of uniq(result.leftGameIds)) await refreshRecruitPost({ server, gameId });
  for (const game of result.cancelledGames) await notifyGameCancelled({ server, game });
  for (const gameId of result.autoConfirmedGameIds) {
    await evaluateGameBadges({ serverId: server.id, gameId });
  }
  revalidatePath(`/${server.slug}`, "layout");
  return true;
}
