import { discordBotApi } from "../api/discord-bot-api";
import { discordMessageBody } from "../api/discord-message-body";
import type { DiscordMessageInput } from "../model/discord-types";

// 봇이 보낸 메시지만 고칠 수 있다. 빠진 필드(content 등)는 그대로 남는다.
export async function editDiscordMessage(
  channelId: string | null | undefined,
  messageId: string,
  input: DiscordMessageInput,
) {
  if (!channelId) return;
  try {
    await discordBotApi(`/channels/${channelId}/messages/${messageId}`, {
      method: "PATCH",
      body: discordMessageBody(input),
    });
  } catch (error) {
    console.warn("Discord message edit failed:", error);
  }
}
