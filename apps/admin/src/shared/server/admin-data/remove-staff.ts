import "server-only";
import { db, profiles, staff } from "@roll-and-call/database";
import { and, eq, ne } from "drizzle-orm";

import { STAFF_ROLE_LABEL } from "@/shared/lib";

import { recordAudit } from "./record-audit";
import type { Actor } from "./types";

interface RemoveStaffInput {
  reason: string;
  notify: boolean;
}

// ponytail: notify는 활동 기록에만 남긴다. 디스코드 DM은 알림 채널이 생기면 보낸다.
export async function removeStaff(userId: string, actor: Actor, input: RemoveStaffInput) {
  await db.transaction(async (tx) => {
    const [removed] = await tx
      .delete(staff)
      .where(and(eq(staff.userId, userId), ne(staff.role, "owner")))
      .returning({ role: staff.role });
    if (!removed) throw new Error("운영진을 찾을 수 없거나 소유자입니다");
    const [user] = await tx
      .select({ nickname: profiles.username })
      .from(profiles)
      .where(eq(profiles.id, userId));
    await recordAudit(tx, actor, {
      action: "운영진 해제",
      target: `${user?.nickname ?? ""} · ${STAFF_ROLE_LABEL[removed.role]}`,
      targetUserId: userId,
      reason: input.reason,
      before: { label: STAFF_ROLE_LABEL[removed.role] },
      after: { label: "일반 유저" },
      related: input.notify ? ["당사자에게 디스코드 알림 보냄"] : [],
    });
  });
}
