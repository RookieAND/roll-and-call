import { discordBotApi } from "../api/discord-bot-api";

export async function deleteDiscordThread(threadId: string) {
  try {
    await discordBotApi({ path: `/channels/${threadId}`, method: "DELETE" });
  } catch (error) {
    console.warn("Discord thread deletion failed:", error);
  }
}
