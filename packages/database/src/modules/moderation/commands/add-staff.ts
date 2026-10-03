import { eq } from "drizzle-orm";

import { db } from "#/client";
import { STAFF_ROLE_LABEL } from "#/modules/moderation/model/staff-role-label";
import type { Actor, StaffRole } from "#/modules/moderation/model/types";
import { profiles, staff } from "#/schema";

import { recordAudit } from "./record-audit";

// ponytail: 당사자 디스코드 알림은 아직 보내지 않는다. 알림 채널이 생기면 여기서 보낸다.
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
    .select({ nickname: profiles.username })
    .from(profiles)
    .where(eq(profiles.id, userId));
  if (!user) throw new Error("유저를 찾을 수 없습니다");
  await db.transaction(async (tx) => {
    const [added] = await tx
      .insert(staff)
      .values({ serverId, userId, role })
      .onConflictDoNothing()
      .returning({ userId: staff.userId });
    if (!added) throw new Error("이미 운영진입니다");
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
      },
    });
  });
}
