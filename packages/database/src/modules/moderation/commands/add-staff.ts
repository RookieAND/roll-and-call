import { eq } from "drizzle-orm";

import { db } from "#/client";
import { STAFF_ROLE_LABEL } from "#/modules/moderation/model/staff-role-label";
import type { Actor, StaffRole } from "#/modules/moderation/model/types";
import { createNotifications } from "#/modules/notifications/commands/create-notifications";
import { NOTIFICATION_KIND } from "#/modules/notifications/model/notification-kind";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { profiles, staff } from "#/schema";

import { recordAudit } from "./record-audit";

// 그사이 이미 운영진이 됐으면 { ok: false }. 당사자 알림(staff_added)은 같은 트랜잭션에서 넣는다.
export async function addStaff({
  serverId,
  userId,
  role,
  actor,
}: {
  serverId: string;
  userId: string;
  role: StaffRole;
  actor: Actor;
}) {
  const [user] = await db
    .select({ nickname: memberNicknameSql(serverId) })
    .from(profiles)
    .where(eq(profiles.id, userId));
  if (!user) throw new Error("유저를 찾을 수 없습니다");
  return db.transaction(async (tx) => {
    const [added] = await tx
      .insert(staff)
      .values({ serverId, userId, role })
      .onConflictDoNothing()
      .returning({ userId: staff.userId });
    if (!added) return { ok: false as const };
    await createNotifications({
      executor: tx,
      serverId,
      actorId: actor.id,
      notifications: [{ userId, kind: NOTIFICATION_KIND.staffAdded, params: {} }],
    });
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "운영진 추가",
        target: `${user.nickname} · ${STAFF_ROLE_LABEL[role]}`,
        targetUserId: userId,
        reason: "",
        before: { label: "일반 유저" },
        after: { label: STAFF_ROLE_LABEL[role] },
        related: ["당사자 알림 탭에 알림 보냄"],
      },
    });
    return { ok: true as const };
  });
}
