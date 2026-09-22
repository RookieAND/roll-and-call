import type { Game } from "@trpg/database";
import { sendDiscordMessage, DISCORD_COLOR } from "@trpg/discord";

import { formatDateTime } from "@/shared/lib";

import { discordChannelId } from "./discord-channel-id";
import { gameNoticeEmbed } from "./game-notice-embed";

export async function notifySessionStartingSoon(game: Game, gmName: string, mentionIds: string[]) {
  const embed = gameNoticeEmbed({
    game,
    gmName,
    emoji: "⏰",
    color: DISCORD_COLOR.recruit,
    description: "세션이 곧 시작해요!",
    fields: [
      { name: "📜 룰", value: game.rule, inline: true },
      { name: "🕒 시간", value: formatDateTime(game.confirmedAt!), inline: true },
    ],
  });

  await sendDiscordMessage(discordChannelId("recruit"), {
    content: mentionIds.map((discordId) => `<@${discordId}>`).join(" ") || undefined,
    embeds: [embed],
    userMentions: mentionIds,
  });
}
