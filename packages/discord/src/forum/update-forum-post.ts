import { discordBotApi } from "../api/discord-bot-api";
import { discordMessageBody } from "../api/discord-message-body";
import type { DiscordForumPostInput } from "../model/discord-types";

// 게시글이 사라졌으면(누가 지움) false를 돌려 다시 만들게 한다.
export async function updateForumPost(
  threadId: string,
  { name, appliedTags, message }: DiscordForumPostInput,
): Promise<boolean> {
  try {
    await discordBotApi(`/channels/${threadId}`, {
      method: "PATCH",
      body: { name: name.slice(0, 100), applied_tags: appliedTags },
    });
    await discordBotApi(`/channels/${threadId}/messages/${threadId}`, {
      method: "PATCH",
      body: discordMessageBody(message),
    });
    return true;
  } catch (error) {
    console.warn("Discord forum post update failed:", error);
    return !String(error).includes("→ 404");
  }
}
