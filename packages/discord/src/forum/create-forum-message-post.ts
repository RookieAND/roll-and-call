import { discordBotApi } from "../api/discord-bot-api";
import { discordMessageBody } from "../api/discord-message-body";
import type { DiscordMessageInput } from "../model/discord-types";

const ARCHIVE_MINUTES = 10080;

// 임베드와 버튼이 붙은 첫 메시지로 포럼 게시글을 연다. 게시글 id는 첫 메시지 id와 같다.
export async function createForumMessagePost({
  forumId,
  name,
  appliedTags,
  input,
}: {
  forumId: string;
  name: string;
  appliedTags: string[];
  input: DiscordMessageInput;
}): Promise<string | undefined> {
  try {
    const thread = await discordBotApi<{ id: string }>({
      path: `/channels/${forumId}/threads`,
      method: "POST",
      body: {
        name: name.slice(0, 100),
        applied_tags: appliedTags,
        auto_archive_duration: ARCHIVE_MINUTES,
        message: discordMessageBody(input),
      },
    });
    return thread.id;
  } catch (error) {
    console.warn("Discord forum post creation failed:", error);
  }
}
