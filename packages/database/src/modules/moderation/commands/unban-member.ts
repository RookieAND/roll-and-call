import { and, desc, eq, isNotNull } from "drizzle-orm";

import { db } from "#/client";
import type { ChosenReason } from "#/modules/moderation/model/chosen-reason";
import { reasonLabel } from "#/modules/moderation/model/reason-label";
import type { Actor } from "#/modules/moderation/model/types";
import { USER_ACTION_REASON } from "#/modules/moderation/model/user-action-reason";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { auditLog, profiles, serverMembers } from "#/schema";

import { type ModerationConflict } from "./moderation-conflict";
import { recordAudit } from "./record-audit";

export type UnbanResult =
  | { ok: true; discordId: string }
  | { ok: false; conflict: ModerationConflict | null };

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
  reason: ChosenReason;
}): Promise<UnbanResult> {
  const [user] = await db
    .select({ nickname: memberNicknameSql(serverId), discordId: profiles.discordId })
    .from(profiles)
    .where(eq(profiles.id, userId));
  if (!user) throw new Error("유저를 찾을 수 없습니다");

  return db.transaction(async (tx) => {
    const unbanned = await tx
      .update(serverMembers)
      .set({ bannedAt: null, bannedBy: null, banReasonCode: null, banReasonText: null })
      .where(
        and(
          eq(serverMembers.serverId, serverId),
          eq(serverMembers.userId, userId),
          isNotNull(serverMembers.bannedAt),
        ),
      )
      .returning({ userId: serverMembers.userId });
    if (unbanned.length === 0) {
      // 차단 해제는 멤버십 칸을 비우므로 누가 언제 풀었는지는 마지막 「차단 해제」 기록에서 읽는다.
      const [latest] = await tx
        .select({ byId: auditLog.actorId, by: memberNicknameSql(serverId), at: auditLog.createdAt })
        .from(auditLog)
        .leftJoin(profiles, eq(profiles.id, auditLog.actorId))
        .where(
          and(
            eq(auditLog.serverId, serverId),
            eq(auditLog.targetUserId, userId),
            eq(auditLog.action, "차단 해제"),
          ),
        )
        .orderBy(desc(auditLog.createdAt))
        .limit(1);
      const conflict = latest?.byId
        ? { byId: latest.byId, by: latest.by ?? "", at: latest.at }
        : null;
      return { ok: false, conflict };
    }
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "차단 해제",
        target: user.nickname,
        targetUserId: userId,
        reason: reasonLabel({ ...reason, reasons: USER_ACTION_REASON }),
        before: { label: "차단됨" },
        after: { label: "탈퇴" },
      },
    });
    return { ok: true, discordId: user.discordId };
  });
}
