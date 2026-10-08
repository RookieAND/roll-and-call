import { discordBotApi } from "../api/discord-bot-api";
import { discordMessageBody } from "../api/discord-message-body";
import type { DiscordButton } from "../model/discord-types";

// 첫 메시지에 다 못 담은 본문을 이어 보낸 메시지의 머리 표시. 이 표시로 다시 맞출 때 같은 메시지를 찾는다.
export const FOLLOW_UP_MARK = "-# ↳ 이어서";

type ThreadMessage = { id: string; content: string };

// 이어 쓴 메시지를 chunks에 맞춘다: 있으면 고치고, 모자라면 보내고, 남으면 지운다.
export async function syncForumFollowUps({
  threadId,
  chunks,
  buttons = [],
}: {
  threadId: string;
  chunks: string[];
  // 본문을 다 읽은 자리에 오도록 마지막 조각에만 붙인다. 나머지 조각의 버튼은 지운다.
  buttons?: DiscordButton[];
}) {
  try {
    const messages = await discordBotApi<ThreadMessage[]>({
      path: `/channels/${threadId}/messages?limit=100`,
    });
    const existing = messages
      .filter((message) => message.content.startsWith(FOLLOW_UP_MARK))
      .reverse();
    for (const [index, chunk] of chunks.entries()) {
      const body = discordMessageBody({
        content: `${FOLLOW_UP_MARK}\n${chunk}`,
        buttons: index === chunks.length - 1 ? buttons : [],
      });
      const current = existing[index];
      await discordBotApi({
        path: current
          ? `/channels/${threadId}/messages/${current.id}`
          : `/channels/${threadId}/messages`,
        method: current ? "PATCH" : "POST",
        body,
      });
    }
    for (const extra of existing.slice(chunks.length)) {
      await discordBotApi({ path: `/channels/${threadId}/messages/${extra.id}`, method: "DELETE" });
    }
  } catch (error) {
    console.warn("Discord forum follow-ups sync failed:", error);
  }
}
