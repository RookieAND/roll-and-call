import { and, eq, isNotNull, isNull, sql } from "drizzle-orm";

import { db } from "#/client";
import type { Actor } from "#/modules/moderation/model/types";
import { NOTIFICATION_KIND } from "#/modules/notifications/model/notification-kind";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { participants, profiles } from "#/schema";

import { loadNoShowParties } from "./load-no-show-parties";
import { NO_SHOW_NOTIFIED, notifyNoShowParties } from "./notify-no-show-parties";
import { recordAudit } from "./record-audit";

export type CancelNoShowResult =
  | { ok: true }
  | { ok: false; conflict: { by: string; byId: string | null; at: Date; reason: string } };

// 이미 다른 운영진이 취소했으면 아무것도 바꾸지 않고 충돌을 알린다.
export async function cancelNoShow({
  serverId,
  gameId,
  userId,
  actor,
  reason,
}: {
  serverId: string;
  gameId: string;
  userId: string;
  actor: Actor;
  reason: string;
}): Promise<CancelNoShowResult> {
  if (!reason.trim()) throw new Error("취소 사유를 입력해 주세요");
  const row = and(
    eq(participants.serverId, serverId),
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
          by: memberNicknameSql(serverId),
          byId: participants.absenceCancelledBy,
        })
        .from(participants)
        .leftJoin(profiles, eq(profiles.id, participants.absenceCancelledBy))
        .where(and(row, isNotNull(participants.absenceCancelledAt)));
      if (!current) throw new Error("불참 기록을 찾을 수 없습니다");
      return {
        ok: false,
        conflict: {
          by: current.by ?? "알 수 없음",
          byId: current.byId,
          at: current.at!,
          reason: current.reason ?? "",
        },
      };
    }
    const parties = await loadNoShowParties({ tx, serverId, gameId, userId });
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "불참 취소",
        target: `${parties.nickname} · ${parties.title}`,
        targetUserId: userId,
        targetGameId: gameId,
        reason: reason.trim(),
        before: { label: "유효" },
        after: { label: "취소됨" },
        related: [NO_SHOW_NOTIFIED],
      },
    });
    await notifyNoShowParties({
      tx,
      serverId,
      actorId: actor.id,
      kind: NOTIFICATION_KIND.absenceCancelled,
      gameId,
      gameTitle: parties.title,
      userId,
      gmId: parties.gmId,
    });
    return { ok: true };
  });
}
