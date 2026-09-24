import "server-only";
import { db, games, participants, profiles } from "@roll-and-call/database";
import { and, eq, isNotNull, isNull, sql } from "drizzle-orm";

import { parseNoShowId } from "./parse-no-show-id";
import { recordAudit } from "./record-audit";
import type { Actor } from "./types";

export type CancelNoShowResult =
  | { ok: true }
  | { ok: false; conflict: { by: string; at: Date; reason: string } };

// 이미 다른 운영진이 취소했으면 아무것도 바꾸지 않고 충돌을 알린다.
export async function cancelNoShow(
  id: string,
  actor: Actor,
  reason: string,
): Promise<CancelNoShowResult> {
  if (!reason.trim()) throw new Error("취소 사유를 입력해 주세요");
  const { gameId, userId } = parseNoShowId(id);
  const row = and(
    eq(participants.gameId, gameId),
    eq(participants.userId, userId),
    eq(participants.absent, true),
  );
  return db.transaction(async (tx) => {
    const cancelled = await tx
      .update(participants)
      .set({
        absenceCancelledAt: sql`now()`,
        absenceCancelledBy: actor.id,
        absenceCancelReason: reason.trim(),
      })
      .where(and(row, isNull(participants.absenceCancelledAt)))
      .returning({ userId: participants.userId });
    if (cancelled.length === 0) {
      const [current] = await tx
        .select({
          at: participants.absenceCancelledAt,
          reason: participants.absenceCancelReason,
          by: profiles.username,
        })
        .from(participants)
        .leftJoin(profiles, eq(profiles.id, participants.absenceCancelledBy))
        .where(and(row, isNotNull(participants.absenceCancelledAt)));
      if (!current) throw new Error("불참 기록을 찾을 수 없습니다");
      return {
        ok: false,
        conflict: { by: current.by ?? "알 수 없음", at: current.at!, reason: current.reason ?? "" },
      };
    }
    const [names] = await tx
      .select({ nickname: profiles.username, title: games.title })
      .from(games)
      .innerJoin(profiles, eq(profiles.id, userId))
      .where(eq(games.id, gameId));
    await recordAudit(tx, actor, {
      action: "불참 취소",
      target: `${names!.nickname} · ${names!.title}`,
      targetUserId: userId,
      targetGameId: gameId,
      reason: reason.trim(),
      before: { label: "유효" },
      after: { label: "취소됨" },
    });
    return { ok: true };
  });
}
