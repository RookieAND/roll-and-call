import { discordBotApi } from "../api/discord-bot-api";

export type DiscordChannelInfo = {
  type: number;
  parentId: string | null;
  availableTags: { id: string; name: string }[];
};

export async function getDiscordChannel(
  channelId: string,
): Promise<DiscordChannelInfo | undefined> {
  try {
    const channel = await discordBotApi<{
      type: number;
      parent_id?: string | null;
      available_tags?: { id: string; name: string }[];
    }>({ path: `/channels/${channelId}` });
    return {
      type: channel.type,
      parentId: channel.parent_id ?? null,
      availableTags: channel.available_tags ?? [],
    };
  } catch (error) {
    console.warn("Discord channel fetch failed:", error);
  }
}
