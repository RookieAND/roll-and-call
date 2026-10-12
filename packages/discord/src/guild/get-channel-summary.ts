import { discordBotApi } from "../api/discord-bot-api";

export type DiscordChannelSummary = {
  guildId: string | null;
  name: string | null;
  type: number;
  parentId: string | null;
};

// 서버 채널 목록에 없는 스레드(포럼 글 포함)의 이름·부모를 한 건씩 가져온다.
export async function getChannelSummary({
  channelId,
}: {
  channelId: string;
}): Promise<DiscordChannelSummary> {
  const channel = await discordBotApi<{
    guild_id?: string;
    name?: string;
    type: number;
    parent_id?: string | null;
  }>({ path: `/channels/${channelId}` });
  return {
    guildId: channel.guild_id ?? null,
    name: channel.name ?? null,
    type: channel.type,
    parentId: channel.parent_id ?? null,
  };
}
