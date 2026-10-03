import { and, eq, isNotNull } from "drizzle-orm";

import { db } from "#/client";
import type { Actor } from "#/modules/moderation/model/types";
import { profiles, serverMembers } from "#/schema";

import { recordAudit } from "./record-audit";

export type UnbanResult = { ok: true; discordId: string } | { ok: false; alreadyUnbanned: true };

// 차단 칸만 비운다. 멤버십은 나간 상태(deleted_at)로 남아 다시 들어오면 일반 재가입이 된다.
export async function unbanMember({
  serverId,
  userId,
  actor,
  reason,
}: {
  serverId: string;
  userId: string;
  actor: Actor;
  reason: string;
}): Promise<UnbanResult> {
  const [user] = await db
    .select({ nickname: profiles.username, discordId: profiles.discordId })
    .from(profiles)
    .where(eq(profiles.id, userId));
  if (!user) throw new Error("유저를 찾을 수 없습니다");

  return db.transaction(async (tx) => {
    const unbanned = await tx
      .update(serverMembers)
      .set({ bannedAt: null, bannedBy: null, banReason: null })
      .where(
        and(
          eq(serverMembers.serverId, serverId),
          eq(serverMembers.userId, userId),
          isNotNull(serverMembers.bannedAt),
        ),
      )
      .returning({ userId: serverMembers.userId });
    if (unbanned.length === 0) return { ok: false, alreadyUnbanned: true };
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "차단 해제",
        target: user.nickname,
        targetUserId: userId,
        reason,
        before: { label: "차단됨" },
        after: { label: "탈퇴" },
      },
    });
    return { ok: true, discordId: user.discordId };
  });
}
