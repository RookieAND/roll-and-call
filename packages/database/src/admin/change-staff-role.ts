import { and, eq, ne } from "drizzle-orm";

import { db } from "../client";
import { profiles, staff } from "../schema";
import { recordAudit } from "./record-audit";
import { STAFF_ROLE_LABEL } from "./staff-role-label";
import type { Actor, StaffRole } from "./types";

export async function changeStaffRole({
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
  const thisStaff = and(eq(staff.serverId, serverId), eq(staff.userId, userId));
  await db.transaction(async (tx) => {
    const [before] = await tx.select({ role: staff.role }).from(staff).where(thisStaff);
    if (!before) throw new Error("운영진을 찾을 수 없습니다");
    const changed = await tx
      .update(staff)
      .set({ role })
      .where(and(thisStaff, ne(staff.role, role)))
      .returning({ userId: staff.userId });
    if (changed.length === 0) return;
    const [user] = await tx
      .select({ nickname: profiles.username })
      .from(profiles)
      .where(eq(profiles.id, userId));
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "역할 변경",
        target: `${user?.nickname ?? ""} · ${STAFF_ROLE_LABEL[role]}`,
        targetUserId: userId,
        reason: "",
        before: { label: STAFF_ROLE_LABEL[before.role] },
        after: { label: STAFF_ROLE_LABEL[role] },
      },
    });
  });
}
