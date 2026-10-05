import { and, desc, eq } from "drizzle-orm";

import { db } from "#/client";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import type { Actor } from "#/modules/moderation/model/types";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import type { RulebookActionResult } from "#/modules/rulebooks/model/rulebook-action-result";
import { auditLog, profiles, rulebookCategories } from "#/schema";

const AUDIT_ACTION = "미니룰 변경";

// 룰 분류의 미니룰을 켜고 끈다. 서버장만 부르도록 호출하는 쪽(어드민 서버 액션)이 requireOwner로 막는다.
// 이미 그 값이면 UPDATE가 0건이라 다른 서버장이 먼저 바꾼 것으로 보고 충돌을 돌려준다.
// 홈 순위는 다음 요청에 바뀌고, 이달의 GM·PL 뱃지는 다음 재계산에 바뀐다. 굳은 달은 바뀌지 않는다.
export async function setCategoryMiniRule({
  serverId,
  categoryId,
  miniRule,
  actor,
}: {
  serverId: string;
  categoryId: string;
  miniRule: boolean;
  actor: Actor;
}): Promise<RulebookActionResult> {
  return db.transaction(async (tx) => {
    const [category] = await tx
      .select({ name: rulebookCategories.name })
      .from(rulebookCategories)
      .where(and(eq(rulebookCategories.serverId, serverId), eq(rulebookCategories.id, categoryId)));
    if (!category) throw new Error("룰 분류를 찾을 수 없습니다");
    const changed = await tx
      .update(rulebookCategories)
      .set({ miniRule })
      .where(and(eq(rulebookCategories.id, categoryId), eq(rulebookCategories.miniRule, !miniRule)))
      .returning({ id: rulebookCategories.id });
    if (changed.length === 0) {
      const [latest] = await tx
        .select({ at: auditLog.createdAt, by: memberNicknameSql(serverId), byId: auditLog.actorId })
        .from(auditLog)
        .leftJoin(profiles, eq(profiles.id, auditLog.actorId))
        .where(
          and(
            eq(auditLog.serverId, serverId),
            eq(auditLog.action, AUDIT_ACTION),
            eq(auditLog.target, category.name),
          ),
        )
        .orderBy(desc(auditLog.createdAt))
        .limit(1);
      return {
        ok: false,
        conflict: latest
          ? {
              action: AUDIT_ACTION,
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
        action: AUDIT_ACTION,
        target: category.name,
        reason: miniRule ? "미니룰로 켬" : "미니룰을 끔",
        before: { label: miniRule ? "꺼짐" : "켜짐" },
        after: { label: miniRule ? "켜짐" : "꺼짐" },
      },
    });
    return { ok: true };
  });
}
