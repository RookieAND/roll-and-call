import { parseHttpUrl } from "./parse-http-url";

const DISCORD_HOSTS = new Set([
  "discord.com",
  "ptb.discord.com",
  "canary.discord.com",
  "discordapp.com",
]);
// 서버 채널(스레드·포럼 글 포함)만 본다. DM 링크(/channels/@me/…)는 서버 링크가 아니라서 숫자 id만 받는다.
const CHANNEL_PATH = /^\/channels\/(\d+)\/(\d+)(?:\/\d+)?\/?$/;

export interface DiscordChannelLink {
  guildId: string;
  channelId: string;
}

export function parseDiscordChannelLink(href: string): DiscordChannelLink | undefined {
  const url = parseHttpUrl(href);
  if (!url || !DISCORD_HOSTS.has(url.hostname)) return undefined;
  const match = CHANNEL_PATH.exec(url.pathname);
  if (!match) return undefined;
  return { guildId: match[1]!, channelId: match[2]! };
}
