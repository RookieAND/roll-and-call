import { type Server } from "@roll-and-call/database";
import { getGameForNotice } from "@roll-and-call/database/games";
import { countConfirmed, countWaiting } from "@roll-and-call/database/games/model";
import { getUsername } from "@roll-and-call/database/profiles";
import { sendDiscordMessage, DISCORD_COLOR } from "@roll-and-call/discord";

import { gameNoticeEmbed } from "./game-notice-embed";
import { headcountFields } from "./headcount-fields";

// 삭제 후에 불러야 현재 인원이 맞다.
export async function notifyGameLeft({
  server,
  gameId,
  userId,
  removedByGm,
}: {
  server: Server;
  gameId: string;
  userId: string;
  removedByGm: boolean;
}) {
  const [game, username] = await Promise.all([
    getGameForNotice({ serverId: server.id, gameId }),
    getUsername(userId),
  ]);
  if (!game?.discordThreadId) return;

  const name = username ?? "?";
  const embed = gameNoticeEmbed({
    slug: server.slug,
    game,
    gmName: game.gm?.username ?? "?",
    emoji: "🚪",
    color: DISCORD_COLOR.left,
    description: removedByGm
      ? `**${name}**님이 참여 목록에서 제외됐어요.`
      : `**${name}**님이 참여를 취소했어요.`,
    fields: headcountFields({
      game,
      confirmedCount: countConfirmed(game.participants),
      waitingCount: countWaiting(game.participants),
    }),
  });

  await sendDiscordMessage({ channelId: game.discordThreadId, input: { embeds: [embed] } });
}
