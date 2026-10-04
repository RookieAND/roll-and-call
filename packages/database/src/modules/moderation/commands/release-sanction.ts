import { and, eq, gt, isNull, or, sql } from "drizzle-orm";

import { db } from "#/client";
import type { Actor } from "#/modules/moderation/model/types";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { profiles, sanctions } from "#/schema";

import { recordAudit } from "./record-audit";

export type ReleaseResult = { ok: true } | { ok: false; alreadyReleased: true };

export async function releaseSanction({
  serverId,
  userId,
  actor,
  input,
}: {
  serverId: string;
  userId: string;
  actor: Actor;
  input: { userReason: string; staffMemo: string };
}): Promise<ReleaseResult> {
  const [user] = await db
    .select({ nickname: memberNicknameSql(serverId) })
    .from(profiles)
    .where(eq(profiles.id, userId));
  if (!user) throw new Error("유저를 찾을 수 없습니다");
  return db.transaction(async (tx) => {
    const released = await tx
      .update(sanctions)
      .set({ releasedAt: sql`now()`, releasedBy: actor.id })
      .where(
        and(
          eq(sanctions.serverId, serverId),
          eq(sanctions.userId, userId),
          isNull(sanctions.releasedAt),
          or(isNull(sanctions.until), gt(sanctions.until, sql`now()`)),
        ),
      )
      .returning({ id: sanctions.id });
    if (released.length === 0) return { ok: false, alreadyReleased: true };
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "제재 해제",
        target: user.nickname,
        targetUserId: userId,
        reason: input.userReason,
        staffMemo: input.staffMemo || undefined,
      },
    });
    return { ok: true };
  });
}
