import { type Server } from "@roll-and-call/database";
import { getGameForRecruitmentNotice } from "@roll-and-call/database/games";
import { refreshRecruitmentComplete } from "@roll-and-call/game-notices";

import { notifyRecruitmentComplete } from "./notify-recruitment-complete";

// 정원이 막 찬 순간에 부른다. 신청·직접 확정·등록 때 확정·선발 마치기·추첨 어느 길로 차든 같은 공지를 낸다.
// 공지는 구인당 한 번만 나가고, 이미 나갔다면(정원이 비었다 다시 찬 경우 등) 새로 보내지 않고 그 공지를 지금 명단으로 고친다.
export async function announceRecruitmentComplete({
  server,
  gameId,
}: {
  server: Server;
  gameId: string;
}) {
  const game = await getGameForRecruitmentNotice({ serverId: server.id, gameId });
  if (!game) return;

  if (game.completionMessageId) {
    await refreshRecruitmentComplete({ server, gameId });
    return;
  }
  await notifyRecruitmentComplete({ server, game });
}
