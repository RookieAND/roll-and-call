import { discordBotApi } from "../api/discord-bot-api";
import type { DiscordEmbed } from "../model/discord-types";

export async function getDiscordMessage({
  channelId,
  messageId,
}: {
  channelId: string;
  messageId: string;
}): Promise<{ embeds: DiscordEmbed[] } | undefined> {
  try {
    return await discordBotApi<{ embeds: DiscordEmbed[] }>({
      path: `/channels/${channelId}/messages/${messageId}`,
    });
  } catch (error) {
    console.warn("Discord message fetch failed:", error);
  }
}
