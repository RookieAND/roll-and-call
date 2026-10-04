import { and, eq, ne } from "drizzle-orm";

import { db } from "#/client";
import { STAFF_ROLE_LABEL } from "#/modules/moderation/model/staff-role-label";
import type { Actor } from "#/modules/moderation/model/types";
import { createNotifications } from "#/modules/notifications/commands/create-notifications";
import { NOTIFICATION_KIND } from "#/modules/notifications/model/notification-kind";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { profiles, staff } from "#/schema";

import { recordAudit } from "./record-audit";

// 이미 해제됐거나 소유자면 { ok: false }. 당사자 알림(staff_removed, 사유 없음)은 늘 같은 트랜잭션에서 넣는다.
export async function removeStaff({
  serverId,
  userId,
  actor,
  reason,
}: {
  serverId: string;
  userId: string;
  actor: Actor;
  reason: string;
}) {
  return db.transaction(async (tx) => {
    const [removed] = await tx
      .delete(staff)
      .where(and(eq(staff.serverId, serverId), eq(staff.userId, userId), ne(staff.role, "owner")))
      .returning({ role: staff.role });
    if (!removed) return { ok: false as const };
    const [user] = await tx
      .select({ nickname: memberNicknameSql(serverId) })
      .from(profiles)
      .where(eq(profiles.id, userId));
    await createNotifications({
      executor: tx,
      serverId,
      actorId: actor.id,
      notifications: [{ userId, kind: NOTIFICATION_KIND.staffRemoved, params: {} }],
    });
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "운영진 해제",
        target: `${user?.nickname ?? ""} · ${STAFF_ROLE_LABEL[removed.role]}`,
        targetUserId: userId,
        reason,
        before: { label: STAFF_ROLE_LABEL[removed.role] },
        after: { label: "일반 유저" },
        related: ["당사자 알림 탭에 알림 보냄"],
      },
    });
    return { ok: true as const };
  });
}
