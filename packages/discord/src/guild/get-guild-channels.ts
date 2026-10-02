import { discordBotApi } from "../api/discord-bot-api";

export type DiscordPermissionOverwrite = {
  id: string;
  type: 0 | 1;
  allow: string;
  deny: string;
};

export type DiscordGuildChannel = {
  id: string;
  name: string;
  type: number;
  permission_overwrites?: DiscordPermissionOverwrite[];
};

// 봇이 볼 수 없는 채널까지 서버의 채널을 모두 돌려준다(스레드 제외).
export function getGuildChannels({ guildId }: { guildId: string }) {
  return discordBotApi<DiscordGuildChannel[]>({ path: `/guilds/${guildId}/channels` });
}
