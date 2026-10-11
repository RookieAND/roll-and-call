import type { Server } from "@roll-and-call/database";
import { getGameForRecruitmentNotice } from "@roll-and-call/database/games";
import { editDiscordMessage } from "@roll-and-call/discord";

import { recruitmentCompleteEmbed } from "./recruitment-complete-embed";

// 이미 나간 구인 완료 공지를 지금 명단으로 고친다. 머리 줄(멘션)은 그대로 두므로 다시 울리지 않는다.
// 공지가 없거나 지워졌으면 조용히 넘어간다.
export async function refreshRecruitmentComplete({
  server,
  gameId,
}: {
  server: Server;
  gameId: string;
}) {
  const game = await getGameForRecruitmentNotice({ serverId: server.id, gameId });
  if (!game?.completionMessageId || game.cancelledAt) return;

  await editDiscordMessage({
    channelId: server.closedChannelId,
    messageId: game.completionMessageId,
    input: { embeds: [await recruitmentCompleteEmbed({ server, game })] },
  });
}
