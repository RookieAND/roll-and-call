import "server-only";
import { getGuildMember } from "@roll-and-call/discord";
import { unstable_cache } from "next/cache";

import { guildMemberTag } from "./guild-member-tag";

// 봇으로 디스코드 서버 멤버인지 본다. 가입과 탈퇴 확인이 같이 쓰고, 결과는 5분 캐시한다.
// 가입 화면 [다시 확인하기]가 guildMemberTag로 그 사람의 캐시만 지운다(D173).
// 봇이 그 서버에 없는 등 확인 자체가 안 되면 던지고, 던진 결과는 캐시하지 않는다.
// ponytail: unstable_cache를 쓴다. cacheComponents를 켜면 "use cache" + cacheLife + cacheTag로 바꾼다.
export function isDiscordGuildMember(guildId: string, discordUserId: string) {
  return unstable_cache(
    async () => (await getGuildMember({ guildId, discordUserId })) !== null,
    ["discord-guild-member", guildId, discordUserId],
    { revalidate: 300, tags: [guildMemberTag({ guildId, discordUserId })] },
  )();
}
