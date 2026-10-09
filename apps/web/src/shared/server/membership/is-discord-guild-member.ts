import "server-only";
import { getGuildMember } from "@roll-and-call/discord";
import { unstable_cache } from "next/cache";

import { guildMemberTag } from "./guild-member-tag";

class NotGuildMemberSignal extends Error {}

// 봇으로 디스코드 서버 멤버인지 본다. 가입과 탈퇴 확인이 같이 쓰고, 멤버라는 결과만 5분 캐시한다.
// "멤버 아님"은 캐시하지 않는다. 가입 전에 열어 캐시된 결과가 가입한 뒤에도 5분간 가입을 막기 때문이다.
// 가입 화면 [다시 확인하기]가 guildMemberTag로 그 사람의 캐시만 지운다(D173).
// 봇이 그 서버에 없는 등 확인 자체가 안 되면 던지고, 던진 결과는 캐시하지 않는다.
// ponytail: unstable_cache는 던진 결과를 캐시하지 않는 점을 써서 비멤버를 신호로 던진다. cacheComponents를 켜면 "use cache" + cacheLife + cacheTag로 바꾼다.
export async function isDiscordGuildMember(guildId: string, discordUserId: string) {
  try {
    return await unstable_cache(
      async () => {
        if ((await getGuildMember({ guildId, discordUserId })) === null) {
          throw new NotGuildMemberSignal();
        }
        return true;
      },
      ["discord-guild-member", guildId, discordUserId],
      { revalidate: 300, tags: [guildMemberTag({ guildId, discordUserId })] },
    )();
  } catch (error) {
    if (error instanceof NotGuildMemberSignal) return false;
    throw error;
  }
}
