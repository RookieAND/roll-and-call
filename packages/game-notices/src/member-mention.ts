import { getDiscordId } from "@roll-and-call/database/profiles";

export async function memberMention(userId: string) {
  const discordId = await getDiscordId(userId);
  return discordId ? `<@${discordId}>` : "**?**";
}
