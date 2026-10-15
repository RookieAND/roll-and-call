import "server-only";
import { getGuildMember } from "@roll-and-call/discord";
import { isNull } from "es-toolkit";
import { unstable_cache } from "next/cache";

import { guildMemberTag } from "./guild-member-tag";

// 봇으로 디스코드 서버 멤버인지 본다. 가입과 탈퇴 확인이 같이 쓰고, 결과를 5분 캐시한다.
// unstable_cache는 만료된 값을 먼저 돌려주고 뒤에서 다시 묻는다. 뒤에서 던지면 옛 값이 남으므로 던지지 않고 값으로 돌려준다.
// 확인 자체가 안 되면(봇이 그 서버에 없음·5xx·시간 초과) null로 캐시하고 밖에서 던진다.
// 가입은 늘 guildMemberTag로 그 사람의 캐시를 지우고 다시 묻는다(D173).
// ponytail: cacheComponents를 켜면 "use cache" + cacheLife + cacheTag로 바꾼다.
export async function isDiscordGuildMember(guildId: string, discordUserId: string) {
  const member = await unstable_cache(
    async () => {
      try {
        return !isNull(await getGuildMember({ guildId, discordUserId }));
      } catch (error) {
        console.warn("디스코드 멤버 여부를 확인하지 못했습니다:", error);
        return null;
      }
    },
    ["discord-guild-member", guildId, discordUserId],
    { revalidate: 300, tags: [guildMemberTag({ guildId, discordUserId })] },
  )();
  if (isNull(member)) throw new Error("디스코드 멤버 여부를 확인하지 못했습니다.");
  return member;
}
