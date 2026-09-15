import { discordBotApi } from "../api/discord-bot-api";
import { discordMessageBody } from "../api/discord-message-body";
import type { DiscordMessage, DiscordMessageInput } from "../model/discord-types";

// 알림 실패가 유저 동작(개설/신청)을 막으면 안 되므로 실패는 삼킨다. 스레드 id도 채널 id로 받는다.
export async function sendDiscordMessage(
  channelId: string | null | undefined,
  input: DiscordMessageInput,
): Promise<DiscordMessage | undefined> {
  if (!channelId) {
    console.warn("Discord channel id not set; skipping message");
    return;
  }
  try {
    return await discordBotApi<DiscordMessage>(`/channels/${channelId}/messages`, {
      method: "POST",
      body: discordMessageBody(input),
    });
  } catch (error) {
    console.warn("Discord message failed:", error);
  }
}
