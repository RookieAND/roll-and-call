import { type Server } from "@roll-and-call/database";
import { getGameForNotice } from "@roll-and-call/database/games";
import { countConfirmed, countWaiting } from "@roll-and-call/database/games/model";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";

import { gameNoticeEmbed } from "./game-notice-embed";
import { headcountFields } from "./headcount-fields";
import { memberMention } from "./member-mention";

// 바꾼 뒤에 불러야 현재 인원이 맞다.
export async function notifyMovedToWaitlist({
  server,
  gameId,
  userId,
}: {
  server: Server;
  gameId: string;
  userId: string;
}) {
  const [game, mention] = await Promise.all([
    getGameForNotice({ serverId: server.id, gameId }),
    memberMention(userId),
  ]);
  if (!game?.discordThreadId) return;

  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName: game.gm?.username ?? "?",
    emoji: "⏳",
    color: DISCORD_COLOR.waiting,
    description: `${mention}님이 대기로 옮겨졌어요.`,
    fields: headcountFields({
      game,
      confirmedCount: countConfirmed(game.participants),
      waitingCount: countWaiting(game.participants),
    }),
  });

  await sendDiscordMessage({ channelId: game.discordThreadId, input: { embeds: [embed] } });
}
