import { discordBotApi } from "../api/discord-bot-api";

const TAG_NAME_MAX_LENGTH = 20;

type ForumTag = {
  id: string;
  name: string;
  moderated?: boolean;
  emoji_id?: string | null;
  emoji_name?: string | null;
};

const hasEmoji = (tag: ForumTag) => Boolean(tag.emoji_id || tag.emoji_name);

// 없는 이름만 만들고(포럼 태그는 최대 20개), 이모지가 없는 태그에는 emojis에 있는 이모지를 채운다. 이미 이모지가 있으면 건드리지 않는다.
// 기존 태그는 id째 그대로 보내야 지워지지 않는다. 봇에 채널 관리 권한이 필요하다.
export async function addForumTags({
  forumId,
  names,
  emojis = {},
}: {
  forumId: string;
  names: string[];
  emojis?: Record<string, string>;
}): Promise<Map<string, string> | undefined> {
  try {
    const forum = await discordBotApi<{ available_tags?: ForumTag[] }>({
      path: `/channels/${forumId}`,
    });
    const existing = forum.available_tags ?? [];
    const emojiOf = (name: string) => emojis[name] ?? emojis[name.slice(0, TAG_NAME_MAX_LENGTH)];
    const missing = [...new Set(names.map((name) => name.slice(0, TAG_NAME_MAX_LENGTH)))].filter(
      (name) => !existing.some((tag) => tag.name === name),
    );
    const filled = existing.map((tag) =>
      !hasEmoji(tag) && emojiOf(tag.name) ? { ...tag, emoji_name: emojiOf(tag.name) } : tag,
    );
    const changed = missing.length > 0 || filled.some((tag, index) => tag !== existing[index]);
    const tags = changed
      ? (
          await discordBotApi<{ available_tags: ForumTag[] }>({
            path: `/channels/${forumId}`,
            method: "PATCH",
            body: {
              available_tags: [
                ...filled,
                ...missing.map((name) => ({ name, emoji_name: emojiOf(name) ?? null })),
              ],
            },
          })
        ).available_tags
      : existing;
    return new Map(tags.map((tag) => [tag.name, tag.id]));
  } catch (error) {
    console.warn("Discord forum tag creation failed:", error);
  }
}
