import type { DiscordGuildChannel, DiscordRole } from "@roll-and-call/discord";

export interface GuildSnapshot {
  guildId: string;
  channels: DiscordGuildChannel[];
  roles: DiscordRole[];
  botId: string;
  botRoleIds: string[];
}
