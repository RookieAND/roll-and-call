import { discordBotApi } from "../api/discord-bot-api";

// Discord는 이름 변경을 10분에 2번으로 제한하므로 같으면 부르지 않는다.
// ponytail: 보관(archived)된 스레드는 이름을 못 바꾼다. 실패는 삼키고 넘어간다.
export async function renameDiscordThread(threadId: string, name: string) {
  const nextName = name.slice(0, 100);
  try {
    const thread = await discordBotApi<{ name: string }>(`/channels/${threadId}`);
    if (thread.name === nextName) return;
    await discordBotApi(`/channels/${threadId}`, { method: "PATCH", body: { name: nextName } });
  } catch (error) {
    console.warn("Discord thread rename failed:", error);
  }
}
