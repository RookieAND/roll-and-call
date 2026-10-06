import { discordBotFormApi } from "../api/discord-bot-form-api";

// 이미 보낸 메시지에 이미지 파일을 첨부한다. 글·임베드·버튼은 그대로 둔다. 이름이 SPOILER_로 시작하면 디스코드가 가린다.
// ponytail: 이미 첨부가 있는 메시지에 부르면 기존 첨부가 바뀐다. 모집 글은 첨부가 이 썸네일뿐이다.
export async function addFileToMessage({
  channelId,
  messageId,
  url,
  name,
}: {
  channelId: string;
  messageId: string;
  url: string;
  name: string;
}) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`image fetch ${response.status}`);
    await discordBotFormApi({
      path: `/channels/${channelId}/messages/${messageId}`,
      method: "PATCH",
      payload: {},
      files: [{ name, blob: await response.blob() }],
    });
  } catch (error) {
    console.warn("Discord file attach failed:", error);
  }
}
