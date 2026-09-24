import "server-only";
import { db, profiles, staffMemos } from "@roll-and-call/database";
import { eq } from "drizzle-orm";

import { recordAudit } from "./record-audit";
import type { Actor } from "./types";

export async function addStaffMemo(userId: string, actor: Actor, body: string) {
  const [user] = await db
    .select({ nickname: profiles.username })
    .from(profiles)
    .where(eq(profiles.id, userId));
  if (!user) throw new Error("유저를 찾을 수 없습니다");
  await db.transaction(async (tx) => {
    await tx.insert(staffMemos).values({ userId, authorId: actor.id, body });
    await recordAudit(tx, actor, {
      action: "운영진 메모",
      target: user.nickname,
      targetUserId: userId,
      reason: body,
    });
  });
}
