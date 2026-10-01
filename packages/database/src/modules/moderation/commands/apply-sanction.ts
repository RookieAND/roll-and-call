import { and, eq, isNull, lte, sql } from "drizzle-orm";
import { isNil } from "es-toolkit";

import { db } from "../../../client";
import { profiles, sanctions } from "../../../schema";
import type { Actor, Sanction } from "../model/types";
import { applyOngoingChoices, type OngoingChoice } from "./apply-ongoing-choices";
import { recordAudit } from "./record-audit";

const DAY = 86_400_000;

export interface SanctionInput {
  days: number | null;
  userReason: string;
  staffMemo: string;
  ongoing: OngoingChoice[];
}

export type SanctionResult = { ok: true } | { ok: false; conflict: Sanction };

// 그사이 다른 운영진이 먼저 제재했다면 아무것도 바꾸지 않는다.
export async function applySanction({
  serverId,
  userId,
  actor,
  input,
}: {
  serverId: string;
  userId: string;
  actor: Actor;
  input: SanctionInput;
}): Promise<SanctionResult> {
  const [user] = await db
    .select({ nickname: profiles.username })
    .from(profiles)
    .where(eq(profiles.id, userId));
  if (!user) throw new Error("유저를 찾을 수 없습니다");

  const thisUser = and(eq(sanctions.serverId, serverId), eq(sanctions.userId, userId));
  return db.transaction(async (tx) => {
    // 기한이 지난 제재는 풀린 것으로 닫아야 새 제재가 유니크 인덱스를 통과한다.
    await tx
      .update(sanctions)
      .set({ releasedAt: sanctions.until })
      .where(and(thisUser, isNull(sanctions.releasedAt), lte(sanctions.until, sql`now()`)));
    const now = new Date();
    const [created] = await tx
      .insert(sanctions)
      .values({
        serverId,
        userId,
        reason: input.userReason,
        until: isNil(input.days) ? null : new Date(now.getTime() + input.days * DAY),
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
        .where(and(thisUser, isNull(sanctions.releasedAt)));
      return { ok: false, conflict: { ...current!, by: current!.by ?? "알 수 없음" } };
    }
    await applyOngoingChoices({ executor: tx, serverId, userId, choices: input.ongoing });
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "제재",
        target: `${user.nickname} · ${isNil(input.days) ? "무기한" : `${input.days}일`}`,
        targetUserId: userId,
        reason: input.userReason,
        staffMemo: input.staffMemo || undefined,
      },
    });
    return { ok: true };
  });
}
