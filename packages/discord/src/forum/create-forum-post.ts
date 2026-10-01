import { discordBotFormApi } from "../api/discord-bot-form-api";
import type { DiscordForumPostInput } from "../model/discord-types";

// 포럼 게시글은 스레드이고, 첫 메시지 id가 스레드 id와 같다.
export async function createForumPost({
  forumId,
  name,
  appliedTags,
  content,
  files,
}: DiscordForumPostInput & { forumId: string }): Promise<string | undefined> {
  try {
    const thread = await discordBotFormApi<{ id: string }>({
      path: `/channels/${forumId}/threads`,
      method: "POST",
      payload: { name: name.slice(0, 100), applied_tags: appliedTags, message: { content } },
      files,
    });
    return thread.id;
  } catch (error) {
    console.warn("Discord forum post creation failed:", error);
  }
}
