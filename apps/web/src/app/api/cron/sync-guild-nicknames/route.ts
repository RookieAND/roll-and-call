import {
  applyNicknameSync,
  listMembersForNicknameSync,
  listServers,
} from "@roll-and-call/database/servers";
import { isTestDiscordId, planNicknameSync } from "@roll-and-call/database/servers/model";
import { isUniqueViolation } from "@roll-and-call/database/transaction";
import { getGuildMember, guildMemberDisplayName } from "@roll-and-call/discord";
import { isUndefined } from "es-toolkit";

import { checkEachMember, isCronRequest } from "@/shared/server";

// C01 작업 2: 기존 멤버 닉네임을 디스코드 서버 닉네임으로 한 번 맞춘다. 크론으로 등록하지 않고 손으로 부른다.
// apply=1이 없으면 미리 보기만 하고, server=슬러그로 한 서버만 고를 수 있다. 작업 5에서 지운다.
export async function GET(request: Request) {
  if (!isCronRequest(request)) return new Response("Unauthorized", { status: 401 });
  const { searchParams } = new URL(request.url);
  const apply = searchParams.get("apply") === "1";
  const slug = searchParams.get("server");

  const results = [];
  for (const server of await listServers()) {
    if (slug && server.slug !== slug) continue;
    const members = await listMembersForNicknameSync(server.id);
    const askable = members.filter(
      (member) => member.hasAccount && !isTestDiscordId(member.discordId),
    );
    const names = await checkEachMember({
      members: askable,
      check: async (member) => {
        const guildMember = await getGuildMember({
          guildId: server.discordGuildId,
          discordUserId: member.discordId,
        });
        return guildMember ? (guildMemberDisplayName(guildMember) ?? null) : null;
      },
    });
    if (isUndefined(names)) {
      results.push({ server: server.slug, checked: 0, kept: 0, changed: [], skipped: true });
      continue;
    }
    const { changes, kept } = planNicknameSync({
      members,
      guildNames: new Map(askable.map((member, index) => [member.userId, names[index] ?? null])),
    });
    let skipped = false;
    if (apply) {
      try {
        await applyNicknameSync({ serverId: server.id, changes });
      } catch (error) {
        // 계산하는 사이 새로 가입한 사람과 겹쳤다. 되돌렸으니 다시 부르면 새 멤버를 넣어 다시 계산한다.
        if (!isUniqueViolation(error, "server_members_active_nickname_uq")) throw error;
        skipped = true;
      }
    }
    results.push({
      server: server.slug,
      checked: askable.length,
      kept,
      changed: changes.map(({ userId, from, to, suffixBase }) => ({
        userId,
        from,
        to,
        suffixed: suffixBase !== null,
      })),
      skipped,
    });
  }
  return Response.json({ ok: true, applied: apply, servers: results });
}
