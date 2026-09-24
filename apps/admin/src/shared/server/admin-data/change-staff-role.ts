import "server-only";
import { db, profiles, staff } from "@roll-and-call/database";
import { and, eq, ne } from "drizzle-orm";

import { STAFF_ROLE_LABEL } from "@/shared/lib";

import { recordAudit } from "./record-audit";
import type { Actor, StaffRole } from "./types";

export async function changeStaffRole(userId: string, role: StaffRole, actor: Actor) {
  await db.transaction(async (tx) => {
    const [before] = await tx
      .select({ role: staff.role })
      .from(staff)
      .where(eq(staff.userId, userId));
    if (!before) throw new Error("운영진을 찾을 수 없습니다");
    const changed = await tx
      .update(staff)
      .set({ role })
      .where(and(eq(staff.userId, userId), ne(staff.role, role)))
      .returning({ userId: staff.userId });
    if (changed.length === 0) return;
    const [user] = await tx
      .select({ nickname: profiles.username })
      .from(profiles)
      .where(eq(profiles.id, userId));
    await recordAudit(tx, actor, {
      action: "역할 변경",
      target: `${user?.nickname ?? ""} · ${STAFF_ROLE_LABEL[role]}`,
      targetUserId: userId,
      reason: "",
      before: { label: STAFF_ROLE_LABEL[before.role] },
      after: { label: STAFF_ROLE_LABEL[role] },
    });
  });
}
