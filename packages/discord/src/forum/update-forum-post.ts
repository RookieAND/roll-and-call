import { discordBotApi } from "../api/discord-bot-api";
import { discordBotFormApi } from "../api/discord-bot-form-api";
import type { DiscordForumPostInput } from "../model/discord-types";

// 첨부는 통째로 새로 올린다. 게시글이 사라졌거나 고칠 수 없으면 false를 돌려 다시 만들게 한다.
export async function updateForumPost({
  threadId,
  name,
  appliedTags,
  content,
  files,
}: DiscordForumPostInput & { threadId: string }): Promise<boolean> {
  try {
    await discordBotApi({
      path: `/channels/${threadId}`,
      method: "PATCH",
      body: { name: name.slice(0, 100), applied_tags: appliedTags },
    });
    await discordBotFormApi({
      path: `/channels/${threadId}/messages/${threadId}`,
      method: "PATCH",
      payload: { content, embeds: [], components: [] },
      files,
    });
    return true;
  } catch (error) {
    console.warn("Discord forum post update failed:", error);
    return false;
  }
}
