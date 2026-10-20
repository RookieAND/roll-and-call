import { discordBotApi } from "../api/discord-bot-api";

const THREAD_NAME_MAX = 100;
const ARCHIVE_AFTER_MINUTES = 1440;

// 메시지에서 연 스레드의 id는 메시지 id와 같다. 이미 스레드가 있으면 디스코드가 거절하므로 실패는 삼키고 그 스레드에 이어 쓴다.
export async function startMessageThread({
  channelId,
  messageId,
  name,
}: {
  channelId: string;
  messageId: string;
  name: string;
}) {
  try {
    await discordBotApi({
      path: `/channels/${channelId}/messages/${messageId}/threads`,
      method: "POST",
      body: { name: name.slice(0, THREAD_NAME_MAX), auto_archive_duration: ARCHIVE_AFTER_MINUTES },
    });
  } catch {
    // 이미 열린 스레드거나 권한이 없다. 뒤이은 메시지 발송이 실패를 남긴다.
  }
  return messageId;
}
