import { eq } from "drizzle-orm";

import { db } from "#/client";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { profiles, servers, staff, type Server } from "#/schema";

// 디스코드 길드 정보로 이름·아이콘·서버장을 맞춘다. 서버장이 바뀌면 시스템 조치로 기록하고 이전 서버장을 운영진으로 둔다.
export async function syncServerGuild({
  server,
  guild,
}: {
  server: Server;
  guild: { name: string; icon: string | null; ownerDiscordId: string };
}) {
  const changed =
    server.name !== guild.name ||
    server.icon !== guild.icon ||
    server.ownerDiscordId !== guild.ownerDiscordId;
  if (!changed) return server;
  return db.transaction(async (tx) => {
    const [updated] = await tx
      .update(servers)
      .set({ name: guild.name, icon: guild.icon, ownerDiscordId: guild.ownerDiscordId })
      .where(eq(servers.id, server.id))
      .returning();
    const previousOwnerId = server.ownerDiscordId;
    if (!previousOwnerId || previousOwnerId === guild.ownerDiscordId) return updated!;
    const [[previous], [next]] = await Promise.all([
      tx
        .select({ id: profiles.id, nickname: memberNicknameSql(server.id) })
        .from(profiles)
        .where(eq(profiles.discordId, previousOwnerId)),
      tx
        .select({ id: profiles.id, nickname: memberNicknameSql(server.id) })
        .from(profiles)
        .where(eq(profiles.discordId, guild.ownerDiscordId)),
    ]);
    if (previous) {
      await tx
        .insert(staff)
        .values({ serverId: server.id, userId: previous.id, role: "staff" })
        .onConflictDoUpdate({ target: [staff.serverId, staff.userId], set: { role: "staff" } });
    }
    const previousName = previous?.nickname ?? "알 수 없음";
    const lastCode = previousName.charCodeAt(previousName.length - 1) - 0xac00;
    const particle = lastCode >= 0 && lastCode < 11172 && lastCode % 28 !== 0 ? "은" : "는";
    await recordAudit({
      executor: tx,
      serverId: server.id,
      actor: null,
      entry: {
        action: "소유권 자동 이전",
        target: `${guild.name} · ${next?.nickname ?? "알 수 없음"}`,
        targetUserId: next?.id,
        reason: `디스코드 서버 소유권 이전 · 이전 소유자 ${previousName}${particle} 운영진으로 변경`,
        before: { label: previousName },
        after: { label: next?.nickname ?? "알 수 없음" },
      },
    });
    return updated!;
  });
}
