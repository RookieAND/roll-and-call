import { DiscordApiError } from "../api/discord-api-error";
import { discordBotApi } from "../api/discord-bot-api";

// 10026(Unknown Ban): 그 서버에서 차단되지 않은 사람이다.
const UNKNOWN_BAN = 10026;

export async function isGuildBanned({
  guildId,
  discordUserId,
}: {
  guildId: string;
  discordUserId: string;
}) {
  try {
    await discordBotApi({ path: `/guilds/${guildId}/bans/${discordUserId}` });
    return true;
  } catch (error) {
    if (error instanceof DiscordApiError && error.code === UNKNOWN_BAN) return false;
    throw error;
  }
}
