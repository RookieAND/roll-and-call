import { DiscordApiError } from "../api/discord-api-error";
import { discordBotApi } from "../api/discord-bot-api";

export type DiscordGuild = { id: string; name: string; icon: string | null; owner_id: string };

// 10004(Unknown Guild)·50001(Missing Access)는 봇이 그 서버에서 빠졌다는 뜻이다.
const BOT_REMOVED_CODES: ReadonlySet<number> = new Set([10004, 50001]);

// 봇이 들어가 있는 서버 정보. 봇이 빠졌으면 null.
export async function getGuild({ guildId }: { guildId: string }) {
  try {
    return await discordBotApi<DiscordGuild>({ path: `/guilds/${guildId}` });
  } catch (error) {
    if (error instanceof DiscordApiError && BOT_REMOVED_CODES.has(error.code ?? 0)) return null;
    throw error;
  }
}
