import "server-only";
import { db, profiles, sanctions } from "@roll-and-call/database";
import { and, eq, isNull, lte, sql } from "drizzle-orm";

import { applyOngoingChoices, type OngoingChoice } from "./apply-ongoing-choices";
import { recordAudit } from "./record-audit";
import type { Actor, Sanction } from "./types";

const DAY = 86_400_000;

export interface SanctionInput {
  days: number | null;
  userReason: string;
  staffMemo: string;
  ongoing: OngoingChoice[];
}

export type SanctionResult = { ok: true } | { ok: false; conflict: Sanction };

// 제재 확정. 그사이 다른 운영진이 먼저 제재했다면 아무것도 바꾸지 않는다.
export async function applySanction(
  userId: string,
  actor: Actor,
  input: SanctionInput,
): Promise<SanctionResult> {
  const [user] = await db
    .select({ nickname: profiles.username })
    .from(profiles)
    .where(eq(profiles.id, userId));
  if (!user) throw new Error("유저를 찾을 수 없습니다");

  return db.transaction(async (tx) => {
    // 기한이 지난 제재는 풀린 것으로 닫아야 새 제재가 유니크 인덱스를 통과한다.
    await tx
      .update(sanctions)
      .set({ releasedAt: sanctions.until })
      .where(
        and(
          eq(sanctions.userId, userId),
          isNull(sanctions.releasedAt),
          lte(sanctions.until, sql`now()`),
        ),
      );
    const now = new Date();
    const [created] = await tx
      .insert(sanctions)
      .values({
        userId,
        reason: input.userReason,
        until: input.days === null ? null : new Date(now.getTime() + input.days * DAY),
        createdBy: actor.id,
      })
      .onConflictDoNothing()
      .returning({ id: sanctions.id });
    if (!created) {
      const [current] = await tx
        .select({
          until: sanctions.until,
          at: sanctions.createdAt,
          reason: sanctions.reason,
          by: profiles.username,
        })
        .from(sanctions)
        .leftJoin(profiles, eq(profiles.id, sanctions.createdBy))
        .where(and(eq(sanctions.userId, userId), isNull(sanctions.releasedAt)));
      return { ok: false, conflict: { ...current!, by: current!.by ?? "알 수 없음" } };
    }
    await applyOngoingChoices(tx, userId, input.ongoing);
    await recordAudit(tx, actor, {
      action: "제재",
      target: `${user.nickname} · ${input.days === null ? "무기한" : `${input.days}일`}`,
      targetUserId: userId,
      reason: input.userReason,
      staffMemo: input.staffMemo || undefined,
    });
    return { ok: true };
  });
}
