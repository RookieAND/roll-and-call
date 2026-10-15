import { listActiveMembers, listServers } from "@roll-and-call/database/servers";
import { isTestDiscordId } from "@roll-and-call/database/servers/model";
import { getGuildMember } from "@roll-and-call/discord";
import { isNull } from "es-toolkit";

import { findDepartedMembers, handleMemberLeft, isCronRequest } from "@/shared/server";

export const maxDuration = 300;

// Vercel Cron이 매일 04:10(KST)에 부른다. 화면에 들어오지 않는 사람의 디스코드 서버 탈퇴를 맞춘다.
// 5분 캐시를 거치지 않고 봇으로 바로 확인한다. 확인에 실패한 서버는 건너뛰고, 한 서버·한 사람이 실패해도 다음으로 넘어간다.
export async function GET(request: Request) {
  if (!isCronRequest(request)) return new Response("Unauthorized", { status: 401 });
  const results = [];
  for (const server of await listServers()) {
    try {
      const members = (await listActiveMembers(server.id)).filter(
        (member) => !isTestDiscordId(member.discordId),
      );
      const { skipped, checked, departed } = await findDepartedMembers({
        members,
        isMember: async (member) =>
          !isNull(
            await getGuildMember({
              guildId: server.discordGuildId,
              discordUserId: member.discordId,
            }),
          ),
      });
      let left = 0;
      for (const member of departed) {
        try {
          if (await handleMemberLeft({ server, userId: member.userId })) left += 1;
        } catch (error) {
          console.error("members cron 탈퇴 처리 실패", { userId: member.userId, error });
        }
      }
      results.push({ server: server.slug, checked, left, skipped });
    } catch (error) {
      console.error("members cron 서버 처리 실패", { serverId: server.id, error });
      results.push({ server: server.slug, failed: true });
    }
  }
  return Response.json({ ok: true, servers: results });
}
