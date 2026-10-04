import { DiscordApiError } from "../api/discord-api-error";
import { discordBotApi } from "../api/discord-bot-api";

export type DiscordGuildMember = {
  user: { id: string; username: string; global_name: string | null };
  nick?: string | null;
  joined_at: string;
  roles: string[];
};

// 디스코드가 "그 서버에 없는 사람"으로 답하는 코드. 10004(Unknown Guild, 봇이 그 서버에 없음)는 설정 문제라 오류로 올린다.
const NOT_A_MEMBER_CODES: ReadonlySet<number> = new Set([10007, 10013]);

// 봇이 들어가 있는 서버에서 한 사람을 찾는다. 멤버가 아니면 null.
// 한 명 조회는 Server Members 특권 intent가 필요 없다.
export async function getGuildMember({
  guildId,
  discordUserId,
}: {
  guildId: string;
  discordUserId: string;
}) {
  try {
    return await discordBotApi<DiscordGuildMember>({
      path: `/guilds/${guildId}/members/${discordUserId}`,
    });
  } catch (error) {
    if (error instanceof DiscordApiError && NOT_A_MEMBER_CODES.has(error.code ?? 0)) return null;
    throw error;
  }
}
