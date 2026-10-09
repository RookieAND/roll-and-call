import { discordBotApi } from "../api/discord-bot-api";

// 읽지 못하면 첨부가 있다고 본다. 확신 없이 다시 올려 기존 첨부를 덮어쓰지 않는다.
export async function hasMessageAttachment({
  channelId,
  messageId,
}: {
  channelId: string;
  messageId: string;
}) {
  try {
    const message = await discordBotApi<{ attachments: unknown[] }>({
      path: `/channels/${channelId}/messages/${messageId}`,
    });
    return message.attachments.length > 0;
  } catch (error) {
    console.warn("Discord message read failed:", error);
    return true;
  }
}
