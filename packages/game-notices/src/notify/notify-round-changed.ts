import { type Server } from "@roll-and-call/database";
import { getGameForNotice } from "@roll-and-call/database/games";
import { DISCORD_COLOR, sendDiscordMessage } from "@roll-and-call/discord";

import { gameHeadValues, messageHeadInput } from "../lib/message-head-input";
import { gameNoticeEmbed } from "./game-notice-embed";

// 다회차 회차를 옮기거나 생략했을 때 구인 스레드에 올리는 「회차 일정 변경」 안내. 본문은 시스템 문장이고 머리 줄만 서버가 고친다.
export async function notifyRoundChanged({
  server,
  gameId,
  description,
}: {
  server: Server;
  gameId: string;
  description: string;
}) {
  const game = await getGameForNotice({ serverId: server.id, gameId });
  if (!game?.discordThreadId || game.visibility !== "public") return;
  const gmName = game.gm?.username ?? "?";
  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName,
    emoji: "🗓️",
    color: DISCORD_COLOR.recruit,
    description,
  });
  await sendDiscordMessage({
    channelId: game.discordThreadId,
    input: {
      embeds: [embed],
      ...(await messageHeadInput({
        serverId: server.id,
        key: "round_change",
        values: gameHeadValues({ server, game, gmName }),
      })),
    },
  });
}
