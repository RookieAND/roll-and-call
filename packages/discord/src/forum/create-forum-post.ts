import { discordBotApi } from "../api/discord-bot-api";
import { discordMessageBody } from "../api/discord-message-body";
import type { DiscordForumPostInput } from "../model/discord-types";

// 포럼 게시글은 스레드이고, 첫 메시지 id가 스레드 id와 같다.
export async function createForumPost(
  forumId: string,
  { name, appliedTags, message }: DiscordForumPostInput,
): Promise<string | undefined> {
  try {
    const thread = await discordBotApi<{ id: string }>(`/channels/${forumId}/threads`, {
      method: "POST",
      body: {
        name: name.slice(0, 100),
        applied_tags: appliedTags,
        message: discordMessageBody(message),
      },
    });
    return thread.id;
  } catch (error) {
    console.warn("Discord forum post creation failed:", error);
  }
}
