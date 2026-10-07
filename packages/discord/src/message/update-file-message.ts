import { discordBotFormApi } from "../api/discord-bot-form-api";
import type { DiscordFile } from "../model/discord-types";

// 첨부는 통째로 새로 올린다. 메시지가 사라졌거나 고칠 수 없으면 false를 돌려 다시 만들게 한다.
export async function updateFileMessage({
  channelId,
  messageId,
  content,
  files,
}: {
  channelId: string;
  messageId: string;
  content: string;
  files: DiscordFile[];
}): Promise<boolean> {
  try {
    await discordBotFormApi({
      path: `/channels/${channelId}/messages/${messageId}`,
      method: "PATCH",
      payload: { content },
      files,
    });
    return true;
  } catch (error) {
    console.warn("Discord file message update failed:", error);
    return false;
  }
}
