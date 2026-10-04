import { and, eq, ne } from "drizzle-orm";

import { db } from "#/client";
import { STAFF_ROLE_LABEL } from "#/modules/moderation/model/staff-role-label";
import type { Actor } from "#/modules/moderation/model/types";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { profiles, staff } from "#/schema";

import { recordAudit } from "./record-audit";

// ponytail: notify는 활동 기록에만 남긴다. 디스코드 DM은 알림 채널이 생기면 보낸다.
export async function removeStaff({
  serverId,
  userId,
  actor,
  reason,
  notify,
}: {
  serverId: string;
  userId: string;
  actor: Actor;
  reason: string;
  notify: boolean;
}) {
  await db.transaction(async (tx) => {
    const [removed] = await tx
      .delete(staff)
      .where(and(eq(staff.serverId, serverId), eq(staff.userId, userId), ne(staff.role, "owner")))
      .returning({ role: staff.role });
    if (!removed) throw new Error("운영진을 찾을 수 없거나 소유자입니다");
    const [user] = await tx
      .select({ nickname: memberNicknameSql(serverId) })
      .from(profiles)
      .where(eq(profiles.id, userId));
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
        related: notify ? ["당사자에게 디스코드 알림 보냄"] : [],
      },
    });
  });
}
