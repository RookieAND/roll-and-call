import type { DiscordMessageInput } from "../model/discord-types";

export function discordMessageBody({ content, embeds, userMentions = [] }: DiscordMessageInput) {
  return { content, embeds, allowed_mentions: { parse: [], users: userMentions } };
}
