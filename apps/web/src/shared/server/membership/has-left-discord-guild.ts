import "server-only";
import type { Server } from "@roll-and-call/database";
import { isTestDiscordId } from "@roll-and-call/database/servers/model";

import { isDiscordGuildMember } from "./is-discord-guild-member";

// 봇이 "멤버 아님"이라고 답했을 때만 나갔다고 본다. 조회가 실패하면(권한·5xx·연결 끊김) 멤버로 둔다.
export async function hasLeftDiscordGuild({
  server,
  discordId,
}: {
  server: Server;
  discordId: string;
}): Promise<boolean> {
  if (isTestDiscordId(discordId)) return false;
  try {
    return !(await isDiscordGuildMember(server.discordGuildId, discordId));
  } catch (error) {
    console.warn("디스코드 멤버 여부를 확인하지 못했습니다:", error);
    return false;
  }
}
