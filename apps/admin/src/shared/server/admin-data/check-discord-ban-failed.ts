import "server-only";
import { isGuildBanned } from "@roll-and-call/discord";

// 추방한 유저가 디스코드에서 실제로 차단돼 있는지 매번 묻는다. 확인하지 못하면(봇 연결 끊김 등) 차단 실패로 본다.
export async function checkDiscordBanFailed({
  guildId,
  discordId,
}: {
  guildId: string;
  discordId: string;
}) {
  try {
    return !(await isGuildBanned({ guildId, discordUserId: discordId }));
  } catch {
    return true;
  }
}
