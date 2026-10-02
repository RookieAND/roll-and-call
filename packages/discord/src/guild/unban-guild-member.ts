import { DiscordApiError } from "../api/discord-api-error";
import { discordBotApi } from "../api/discord-bot-api";

// 10026(Unknown Ban): 디스코드에서 이미 풀린 차단은 성공으로 본다.
const UNKNOWN_BAN = 10026;

export async function unbanGuildMember({
  guildId,
  discordUserId,
}: {
  guildId: string;
  discordUserId: string;
}) {
  try {
    await discordBotApi({ path: `/guilds/${guildId}/bans/${discordUserId}`, method: "DELETE" });
  } catch (error) {
    if (error instanceof DiscordApiError && error.code === UNKNOWN_BAN) return;
    throw error;
  }
}
