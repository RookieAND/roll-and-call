import "server-only";
import { isGuildBanned } from "@roll-and-call/discord";

// 롤앤콜에서 차단을 푼 유저가 디스코드에서 아직 차단돼 있는지 매번 묻는다. 확인하지 못하면(봇 연결 끊김 등) 해제 실패로 본다.
export async function checkDiscordUnbanFailed({
  guildId,
  discordId,
}: {
  guildId: string;
  discordId: string;
}) {
  try {
    return await isGuildBanned({ guildId, discordUserId: discordId });
  } catch {
    return true;
  }
}
