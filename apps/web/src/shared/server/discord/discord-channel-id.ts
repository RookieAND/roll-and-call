import { DISCORD_CHANNEL_ENV } from "./discord-constants";

export function discordChannelId(kind: keyof typeof DISCORD_CHANNEL_ENV): string | undefined {
  return process.env[DISCORD_CHANNEL_ENV[kind]];
}
