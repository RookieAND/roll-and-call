import { discordBotApi } from "../api/discord-bot-api";

export type DiscordRole = { id: string; name: string; position: number; permissions: string };

export function getGuildRoles({ guildId }: { guildId: string }) {
  return discordBotApi<DiscordRole[]>({ path: `/guilds/${guildId}/roles` });
}
