import { discordBotApi } from "../api/discord-bot-api";

export async function deleteDiscordMessage({
  channelId,
  messageId,
}: {
  channelId: string;
  messageId: string;
}) {
  try {
    await discordBotApi({ path: `/channels/${channelId}/messages/${messageId}`, method: "DELETE" });
  } catch (error) {
    console.warn("Discord message deletion failed:", error);
  }
}
