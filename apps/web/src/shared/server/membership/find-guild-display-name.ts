import "server-only";
import { isTestDiscordId } from "@roll-and-call/database/servers/model";
import { getGuildMember, guildMemberDisplayName } from "@roll-and-call/discord";

// 가입 때 서버 닉네임 기본값으로 쓸 디스코드 표시 이름. 캐시하지 않는다(가입 직전에 바꾼 닉네임도 받는다).
// 테스트 계정이거나 조회가 실패하면 undefined라, 닉네임 때문에 가입이 막히지 않는다.
export async function findGuildDisplayName({
  guildId,
  discordUserId,
}: {
  guildId: string;
  discordUserId: string;
}) {
  if (isTestDiscordId(discordUserId)) return undefined;
  try {
    const member = await getGuildMember({ guildId, discordUserId });
    return member ? guildMemberDisplayName(member) : undefined;
  } catch {
    return undefined;
  }
}
