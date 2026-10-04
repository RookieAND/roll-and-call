import "server-only";
import { type Server } from "@roll-and-call/database";
import { getGameWithGmName, saveDiscordThreadId } from "@roll-and-call/database/games";

import { announceRecruitmentComplete } from "./announce-recruitment-complete";
import { notifyDirectConfirmed } from "./notify-direct-confirmed";
import { notifyGameCreated } from "./notify-game-created";

// 새 구인을 연 뒤의 디스코드 공지: 모집 공지 → 스레드 저장 → 직접 확정 안내 → 정원이 찼으면 모집 완료.
export async function announceGameOpened({
  server,
  gameId,
  confirmedUserIds,
  maxPlayers,
}: {
  server: Server;
  gameId: string;
  confirmedUserIds: string[];
  maxPlayers: number;
}) {
  const game = await getGameWithGmName({ serverId: server.id, gameId });
  const threadId =
    game &&
    (await notifyGameCreated({
      server,
      game,
      gmName: game.gm?.username ?? "?",
      confirmedCount: confirmedUserIds.length,
    }));
  if (threadId) {
    await saveDiscordThreadId({ serverId: server.id, gameId, threadId });
    await notifyDirectConfirmed({ server, gameId, userIds: confirmedUserIds });
  }
  if (confirmedUserIds.length === maxPlayers) await announceRecruitmentComplete({ server, gameId });
}
