import { discordBotFormApi } from "../api/discord-bot-form-api";

// 이미지 주소를 내려받아 첨부 파일로 보낸다. 이름이 SPOILER_로 시작하면 디스코드가 흐리게 가린다.
export async function sendDiscordFile({
  channelId,
  url,
  name,
}: {
  channelId: string;
  url: string;
  name: string;
}) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`image fetch ${response.status}`);
    await discordBotFormApi({
      path: `/channels/${channelId}/messages`,
      method: "POST",
      payload: {},
      files: [{ name, blob: await response.blob() }],
    });
  } catch (error) {
    console.warn("Discord file send failed:", error);
  }
}
