import { discordBotApi } from "../api/discord-bot-api";

// managedTagIds에 든 태그만 바꾼다. 운영진이 직접 단 다른 태그는 그대로 둔다.
export async function setForumPostTags({
  threadId,
  managedTagIds,
  tagIds,
}: {
  threadId: string;
  managedTagIds: string[];
  tagIds: string[];
}) {
  try {
    const thread = await discordBotApi<{ applied_tags?: string[] }>({
      path: `/channels/${threadId}`,
    });
    const current = thread.applied_tags ?? [];
    const next = [...current.filter((id) => !managedTagIds.includes(id)), ...tagIds];
    if (next.length === current.length && next.every((id) => current.includes(id))) return;
    await discordBotApi({
      path: `/channels/${threadId}`,
      method: "PATCH",
      body: { applied_tags: next },
    });
  } catch (error) {
    console.warn("Discord forum post tag update failed:", error);
  }
}
