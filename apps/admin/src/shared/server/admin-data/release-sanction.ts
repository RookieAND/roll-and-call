import "server-only";
import { db, profiles, sanctions } from "@roll-and-call/database";
import { and, eq, gt, isNull, or, sql } from "drizzle-orm";

import { recordAudit } from "./record-audit";
import type { Actor } from "./types";

export type ReleaseResult = { ok: true } | { ok: false; alreadyReleased: true };

export async function releaseSanction(
  userId: string,
  actor: Actor,
  input: { userReason: string; staffMemo: string },
): Promise<ReleaseResult> {
  const [user] = await db
    .select({ nickname: profiles.username })
    .from(profiles)
    .where(eq(profiles.id, userId));
  if (!user) throw new Error("유저를 찾을 수 없습니다");
  return db.transaction(async (tx) => {
    const released = await tx
      .update(sanctions)
      .set({ releasedAt: sql`now()`, releasedBy: actor.id })
      .where(
        and(
          eq(sanctions.userId, userId),
          isNull(sanctions.releasedAt),
          or(isNull(sanctions.until), gt(sanctions.until, sql`now()`)),
        ),
      )
      .returning({ id: sanctions.id });
    if (released.length === 0) return { ok: false, alreadyReleased: true };
    await recordAudit(tx, actor, {
      action: "제재 해제",
      target: user.nickname,
      targetUserId: userId,
      reason: input.userReason,
      staffMemo: input.staffMemo || undefined,
    });
    return { ok: true };
  });
}
