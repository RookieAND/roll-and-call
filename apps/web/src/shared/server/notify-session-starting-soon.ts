import type { Game } from "@trpg/database";
import { sendDiscordMessage } from "@trpg/discord";

import { formatDateTime } from "@/shared/lib";

import { discordChannelId } from "./discord-channel-id";

export async function notifySessionStartingSoon(game: Game, gmName: string, mentionIds: string[]) {
  const mentions = mentionIds.map((discordId) => `<@${discordId}>`).join(" ");
  const content =
    `⏰ 곧 시작! **${game.title}** 세션이 ${formatDateTime(game.confirmedAt!)}에 시작해요.\n` +
    `룰: ${game.rule} · GM: ${gmName}\n${mentions}`;
  await sendDiscordMessage(discordChannelId("recruit"), { content, userMentions: mentionIds });
}
