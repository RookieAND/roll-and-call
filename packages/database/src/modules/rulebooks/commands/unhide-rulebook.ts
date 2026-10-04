import { and, desc, eq } from "drizzle-orm";

import { db } from "#/client";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import type { Actor } from "#/modules/moderation/model/types";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import type { RulebookActionResult } from "#/modules/rulebooks/model/rulebook-action-result";
import { rulebookLabel } from "#/modules/rulebooks/model/rulebook-label";
import { auditLog, profiles, rulebooks } from "#/schema";

// 숨긴 책을 다시 보이게 한다. 숨길 때 함께 반려한 신청은 되돌리지 않는다.
export async function unhideRulebook({
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
    const shown = await tx
      .update(rulebooks)
      .set({ hidden: false })
      .where(and(eq(rulebooks.id, id), eq(rulebooks.hidden, true)))
      .returning({ id: rulebooks.id });
    if (shown.length === 0) {
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
            eq(auditLog.action, "룰북 숨김 해제"),
            eq(auditLog.target, label),
          ),
        )
        .orderBy(desc(auditLog.createdAt))
        .limit(1);
      return {
        ok: false,
        conflict: latest
          ? {
              action: "룰북 숨김 해제",
              by: latest.by ?? "알 수 없음",
              byId: latest.byId,
              at: latest.at,
            }
          : null,
      };
    }
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "룰북 숨김 해제",
        target: label,
        reason,
        before: { label: "숨김" },
        after: { label: "사용 중" },
      },
    });
    return { ok: true };
  });
}
