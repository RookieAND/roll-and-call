import { discordBotApi } from "../api/discord-bot-api";

// 스레드를 잠근다. 잠긴 스레드는 운영진만 글을 쓸 수 있고, 보관(archived)하지 않아 목록에는 그대로 남는다.
export async function lockDiscordThread(threadId: string) {
  await discordBotApi({ path: `/channels/${threadId}`, method: "PATCH", body: { locked: true } });
}
