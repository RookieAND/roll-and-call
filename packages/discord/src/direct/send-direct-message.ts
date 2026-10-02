import { discordBotApi } from "../api/discord-bot-api";
import { discordMessageBody } from "../api/discord-message-body";
import type { DiscordMessageInput } from "../model/discord-types";

// DM 채널을 열어 보낸다. 상대가 DM을 막았거나 봇과 겹치는 서버가 없으면 DiscordApiError로 실패한다.
export async function sendDirectMessage({
  discordUserId,
  input,
}: {
  discordUserId: string;
  input: DiscordMessageInput;
}) {
  const channel = await discordBotApi<{ id: string }>({
    path: "/users/@me/channels",
    method: "POST",
    body: { recipient_id: discordUserId },
  });
  await discordBotApi({
    path: `/channels/${channel.id}/messages`,
    method: "POST",
    body: discordMessageBody(input),
  });
}
