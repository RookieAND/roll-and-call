import { discordBotApi } from "../api/discord-bot-api";

export type DiscordChannelInfo = {
  type: number;
  parentId: string | null;
  availableTags: { id: string; name: string; emoji: string | null }[];
};

export async function getDiscordChannel(
  channelId: string,
): Promise<DiscordChannelInfo | undefined> {
  try {
    const channel = await discordBotApi<{
      type: number;
      parent_id?: string | null;
      available_tags?: {
        id: string;
        name: string;
        emoji_id?: string | null;
        emoji_name?: string | null;
      }[];
    }>({ path: `/channels/${channelId}` });
    return {
      type: channel.type,
      parentId: channel.parent_id ?? null,
      availableTags: (channel.available_tags ?? []).map((tag) => ({
        id: tag.id,
        name: tag.name,
        // 서버 이모지(emoji_id)는 글자로 그릴 수 없어 유니코드 이모지만 쓴다.
        emoji: tag.emoji_id ? null : (tag.emoji_name ?? null),
      })),
    };
  } catch (error) {
    console.warn("Discord channel fetch failed:", error);
  }
}
