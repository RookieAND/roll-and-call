import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "#db/client";
import { recordAudit } from "#db/modules/audit";
import type { Actor } from "#db/modules/audit";
import { createNotifications } from "#db/modules/notifications";
import { NOTIFICATION_KIND } from "#db/modules/notifications/model";
import { memberNicknameSql } from "#db/modules/profiles";
import type { RulebookActionResult } from "#db/modules/rulebooks/model/rulebook-action-result";
import { rulebookLabel } from "#db/modules/rulebooks/model/rulebook-label";
import { auditLog, certApplications, homebrewRules, profiles, rulebooks } from "#db/schema";

const HIDDEN_TAG = "룰북 숨김";
const HIDDEN_REASON = "운영진이 이 룰북을 목록에서 숨겨 신청이 반려되었습니다.";

// 숨기면 그 책의 심사 중 신청을 같은 트랜잭션에서 반려하고 신청자마다 반려 알림을 만든다. 숨김을 풀어도 되돌리지 않는다.

export async function hideRulebook({
  serverId,
  id,
  actor,
  reason,
}: {
  serverId: string;
  id: string;
  actor: Actor;
  reason: string;
}): Promise<RulebookActionResult> {
  return db.transaction(async (tx) => {
    const [rulebook] = await tx
      .select()
      .from(rulebooks)
      .where(and(eq(rulebooks.serverId, serverId), eq(rulebooks.id, id)));
    if (!rulebook) throw new Error("룰북을 찾을 수 없습니다");
    const label = rulebookLabel(rulebook);
    // 자작 룰도 같은 숨김을 쓰고 활동 기록 유형만 따로 남긴다. 열린 구인은 취소하지 않는다.
    const [homebrew] = await tx
      .select({ rulebookId: homebrewRules.rulebookId })
      .from(homebrewRules)
      .where(eq(homebrewRules.rulebookId, id));
    const action = homebrew ? "자작 룰 숨김" : "룰북 숨김";
    const hidden = await tx
      .update(rulebooks)
      .set({ hidden: true })
      .where(and(eq(rulebooks.id, id), eq(rulebooks.hidden, false)))
      .returning({ id: rulebooks.id });
    if (hidden.length === 0) {
      const [latest] = await tx
        .select({
          at: auditLog.createdAt,
          by: memberNicknameSql(serverId),
          byId: auditLog.actorId,
        })
        .from(auditLog)
        .leftJoin(profiles, eq(profiles.id, auditLog.actorId))
        .where(
          and(
            eq(auditLog.serverId, serverId),
            eq(auditLog.action, action),
            eq(auditLog.target, label),
          ),
        )
        .orderBy(desc(auditLog.createdAt))
        .limit(1);
      return {
        ok: false,
        conflict: latest
          ? {
              action,
              by: latest.by ?? "알 수 없음",
              byId: latest.byId,
              at: latest.at,
            }
          : null,
      };
    }
    const rejected = await tx
      .update(certApplications)
      .set({
        status: "rejected",
        processedBy: actor.id,
        processedAt: sql`now()`,
        rejectTag: HIDDEN_TAG,
        rejectReason: HIDDEN_REASON,
      })
      .where(
        and(
          eq(certApplications.serverId, serverId),
          eq(certApplications.rulebookId, id),
          eq(certApplications.status, "pending"),
        ),
      )
      .returning({ userId: certApplications.userId });
    await createNotifications({
      executor: tx,
      serverId,
      actorId: actor.id,
      notifications: rejected.map((application) => ({
        userId: application.userId,
        kind: NOTIFICATION_KIND.certRejected,
        params: {
          rulebookId: id,
          rulebookName: label,
          rejectionSummary: HIDDEN_TAG,
        },
      })),
    });
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action,
        target: label,
        reason,
        before: { label: "사용 중" },
        after: { label: "숨김" },
        related: rejected.length ? [`심사 중 신청 ${rejected.length}건 함께 반려`] : undefined,
      },
    });
    return { ok: true };
  });
}
