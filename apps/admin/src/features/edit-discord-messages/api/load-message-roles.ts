import "server-only";
import { getGuildRoles } from "@roll-and-call/discord";

// 디스코드에서 역할을 못 읽으면 undefined. 미리보기는 역할 이름만 못 보여 주고 경고도 내지 않는다.
export async function loadMessageRoles(guildId: string) {
  try {
    const roles = await getGuildRoles({ guildId });
    return roles.map(({ id, name }) => ({ id, name }));
  } catch (error) {
    console.warn(error);
  }
}
