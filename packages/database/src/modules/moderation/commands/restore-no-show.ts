import { and, desc, eq, isNotNull } from "drizzle-orm";

import { db } from "#/client";
import type { Actor } from "#/modules/moderation/model/types";
import { NOTIFICATION_KIND } from "#/modules/notifications/model/notification-kind";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { auditLog, participants, profiles } from "#/schema";

import { loadNoShowParties } from "./load-no-show-parties";
import { NO_SHOW_NOTIFIED, notifyNoShowParties } from "./notify-no-show-parties";
import { recordAudit } from "./record-audit";

const ACTION = "불참 취소 되돌리기";

export type RestoreNoShowResult =
  | { ok: true }
  | { ok: false; conflict: { by: string; byId: string | null; at: Date } | null };

// 취소된 불참 기록을 다시 유효로 돌린다. 이미 유효면 아무것도 바꾸지 않고 마지막 되돌리기를 알린다.
export async function restoreNoShow({
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
}): Promise<RestoreNoShowResult> {
  if (!reason.trim()) throw new Error("되돌리는 사유를 입력해 주세요");
  return db.transaction(async (tx) => {
    const restored = await tx
      .update(participants)
      .set({ absenceCancelledAt: null, absenceCancelledBy: null, absenceCancelReason: null })
      .where(
        and(
          eq(participants.serverId, serverId),
          eq(participants.gameId, gameId),
          eq(participants.userId, userId),
          eq(participants.absent, true),
          isNotNull(participants.absenceCancelledAt),
        ),
      )
      .returning({ userId: participants.userId });
    if (restored.length === 0) {
      const [last] = await tx
        .select({ by: memberNicknameSql(serverId), byId: auditLog.actorId, at: auditLog.createdAt })
        .from(auditLog)
        .leftJoin(profiles, eq(profiles.id, auditLog.actorId))
        .where(
          and(
            eq(auditLog.serverId, serverId),
            eq(auditLog.action, ACTION),
            eq(auditLog.targetGameId, gameId),
            eq(auditLog.targetUserId, userId),
          ),
        )
        .orderBy(desc(auditLog.createdAt))
        .limit(1);
      return {
        ok: false,
        conflict: last ? { by: last.by ?? "알 수 없음", byId: last.byId, at: last.at } : null,
      };
    }
    const parties = await loadNoShowParties({ tx, serverId, gameId, userId });
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: ACTION,
        target: `${parties.nickname} · ${parties.title}`,
        targetUserId: userId,
        targetGameId: gameId,
        reason: reason.trim(),
        before: { label: "취소됨" },
        after: { label: "유효" },
        related: [NO_SHOW_NOTIFIED],
      },
    });
    await notifyNoShowParties({
      tx,
      serverId,
      actorId: actor.id,
      kind: NOTIFICATION_KIND.absenceRestored,
      gameId,
      gameTitle: parties.title,
      userId,
      gmId: parties.gmId,
    });
    return { ok: true };
  });
}
