import { discordBotApi } from "../api/discord-bot-api";
import type { DiscordMessage } from "../model/discord-types";

// 메시지에서 연 스레드의 id는 그 메시지 id와 같다.
export async function startDiscordThread(
  message: DiscordMessage,
  name: string,
): Promise<string | undefined> {
  try {
    const thread = await discordBotApi<{ id: string }>(
      `/channels/${message.channel_id}/messages/${message.id}/threads`,
      { method: "POST", body: { name: name.slice(0, 100), auto_archive_duration: 10080 } },
    );
    return thread.id;
  } catch (error) {
    console.warn("Discord thread creation failed:", error);
  }
}
