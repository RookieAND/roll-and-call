import { type Server } from "@roll-and-call/database";
import { getGameForRecruitmentNotice } from "@roll-and-call/database/games";
import { countWaiting, PARTICIPANT_STATUS } from "@roll-and-call/database/games/model";

import { notifyRecruitmentComplete } from "./notify-recruitment-complete";

// 정원이 막 찬 순간에 부른다. 신청·직접 확정·등록 때 확정 어느 길로 차든 같은 공지를 낸다.
export async function announceRecruitmentComplete({
  server,
  gameId,
}: {
  server: Server;
  gameId: string;
}) {
  const game = await getGameForRecruitmentNotice({ serverId: server.id, gameId });
  if (!game) return;

  const players = game.participants
    .filter((participant) => participant.status === PARTICIPANT_STATUS.confirmed)
    .map((participant) => ({
      username: participant.user?.username ?? "?",
      discordId: participant.user?.discordId ?? null,
    }));
  await notifyRecruitmentComplete({
    server,
    game,
    gmName: game.gm?.username ?? "?",
    gmDiscordId: game.gm?.discordId ?? null,
    players,
    waitingCount: countWaiting(game.participants),
  });
}
