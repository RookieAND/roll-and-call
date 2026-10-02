import { discordBotApi } from "../api/discord-bot-api";

// 봇 권한이 없거나 대상 역할이 봇보다 높으면 DiscordApiError(403)로 실패한다.
export async function banGuildMember({
  guildId,
  discordUserId,
}: {
  guildId: string;
  discordUserId: string;
}) {
  await discordBotApi({
    path: `/guilds/${guildId}/bans/${discordUserId}`,
    method: "PUT",
    body: {},
  });
}
