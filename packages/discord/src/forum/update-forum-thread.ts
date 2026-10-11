import { DiscordApiError } from "../api/discord-api-error";
import { discordBotApi } from "../api/discord-bot-api";

const THREAD_NAME_LIMIT = 100;

// 포럼 글의 이름과 태그를 한 요청으로 고친다. 따로 보내면 디스코드가 변경 알림을 각각 보내서,
// 클라이언트가 늦게 도착한 쪽의 낡은 상태(예: 새 제목 + 옛 태그)로 남을 수 있다.
// managedTagIds에 든 태그만 바꾸고, 운영진이 직접 단 다른 태그는 그대로 둔다.
// ponytail: 이름 변경은 10분에 2번으로 제한된다. 이름 때문에 거절되면 태그만 다시 보낸다.
export async function updateForumThread({
  threadId,
  name,
  managedTagIds,
  tagIds,
  skipLocked = false,
}: {
  threadId: string;
  name: string;
  managedTagIds: string[];
  tagIds: string[];
  // 잠긴 글은 태그를 건드리지 않는다. 이름은 그대로 바꾼다.
  skipLocked?: boolean;
}) {
  try {
    const thread = await discordBotApi<{
      name: string;
      applied_tags?: string[];
      thread_metadata?: { locked?: boolean };
    }>({ path: `/channels/${threadId}` });

    const nextName = name.slice(0, THREAD_NAME_LIMIT);
    const current = thread.applied_tags ?? [];
    const nextTags = [...current.filter((id) => !managedTagIds.includes(id)), ...tagIds];
    const tagsChanged = !(
      nextTags.length === current.length && nextTags.every((id) => current.includes(id))
    );
    const changes = {
      ...(thread.name === nextName ? {} : { name: nextName }),
      ...(tagsChanged && !(skipLocked && thread.thread_metadata?.locked)
        ? { applied_tags: nextTags }
        : {}),
    };
    if (Object.keys(changes).length === 0) return;

    try {
      await discordBotApi({ path: `/channels/${threadId}`, method: "PATCH", body: changes });
    } catch (error) {
      const renameRejected =
        error instanceof DiscordApiError && error.status === 429 && "name" in changes;
      if (!renameRejected || !("applied_tags" in changes)) throw error;
      await discordBotApi({
        path: `/channels/${threadId}`,
        method: "PATCH",
        body: { applied_tags: changes.applied_tags },
      });
    }
  } catch (error) {
    console.warn("Discord forum thread update failed:", error);
  }
}
