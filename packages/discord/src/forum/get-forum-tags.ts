import { discordBotApi } from "../api/discord-bot-api";

// 태그 id는 서버 관리자가 태그를 다시 만들면 바뀌므로 이름으로 찾는다.
export async function getForumTags(forumId: string): Promise<Map<string, string>> {
  try {
    const forum = await discordBotApi<{ available_tags?: { id: string; name: string }[] }>({
      path: `/channels/${forumId}`,
    });
    return new Map((forum.available_tags ?? []).map((tag) => [tag.name, tag.id]));
  } catch (error) {
    console.warn("Discord forum tags fetch failed:", error);
    return new Map();
  }
}
