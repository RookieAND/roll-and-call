import { discordBotFormApi } from "../api/discord-bot-form-api";
import type { DiscordFile } from "../model/discord-types";

// 텍스트 채널에 첨부가 달린 메시지를 올리고 메시지 id를 돌려준다. 실패는 삼킨다.
export async function createFileMessage({
  channelId,
  content,
  files,
}: {
  channelId: string;
  content: string;
  files: DiscordFile[];
}): Promise<string | undefined> {
  try {
    const message = await discordBotFormApi<{ id: string }>({
      path: `/channels/${channelId}/messages`,
      method: "POST",
      payload: { content },
      files,
    });
    return message.id;
  } catch (error) {
    console.warn("Discord file message failed:", error);
  }
}
