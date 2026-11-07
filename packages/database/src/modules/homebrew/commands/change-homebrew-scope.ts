import { and, desc, eq } from "drizzle-orm";

import { db } from "#db/client";
import { recordAudit, type Actor } from "#db/modules/audit";
import { memberNicknameSql } from "#db/modules/profiles";
import type { RulebookActionResult } from "#db/modules/rulebooks/model/rulebook-action-result";
import { rulebookLabel } from "#db/modules/rulebooks/model/rulebook-label";
import { auditLog, homebrewRules, profiles, rulebooks } from "#db/schema";

import type { HomebrewRuleScope } from "../model/homebrew-rule-scope";
import { HOMEBREW_SCOPE_LABEL } from "../model/homebrew-scope-label";

const ACTION = "자작 룰 사용 범위 변경";

export const HOMEBREW_SCOPE_HIDDEN = "숨긴 룰은 사용 범위를 바꿀 수 없습니다.";

// 운영진 누구나 바꾼다. 화면이 본 값(from)과 지금 값이 다르면 다른 운영진이 먼저 바꾼 것이라 충돌을 돌려준다.
// 되돌리기는 같은 함수를 반대 값으로 다시 부른다. 제작자에게 알리지 않는다.
export async function changeHomebrewScope({
  serverId,
  rulebookId,
  from,
  to,
  actor,
}: {
  serverId: string;
  rulebookId: string;
  from: HomebrewRuleScope;
  to: HomebrewRuleScope;
  actor: Actor;
}): Promise<RulebookActionResult | { ok: false; blocked: string }> {
  return db.transaction(async (tx) => {
    const [rule] = await tx
      .select({
        scope: homebrewRules.scope,
        hidden: rulebooks.hidden,
        name: rulebooks.name,
        edition: rulebooks.edition,
      })
      .from(homebrewRules)
      .innerJoin(rulebooks, eq(rulebooks.id, homebrewRules.rulebookId))
      .where(and(eq(homebrewRules.serverId, serverId), eq(homebrewRules.rulebookId, rulebookId)))
      .for("update", { of: homebrewRules });
    if (!rule) throw new Error("자작 룰을 찾을 수 없습니다");
    if (rule.hidden) return { ok: false, blocked: HOMEBREW_SCOPE_HIDDEN };
    const target = rulebookLabel(rule);
    if (rule.scope !== from) {
      const [latest] = await tx
        .select({ at: auditLog.createdAt, by: memberNicknameSql(serverId), byId: auditLog.actorId })
        .from(auditLog)
        .leftJoin(profiles, eq(profiles.id, auditLog.actorId))
        .where(
          and(
            eq(auditLog.serverId, serverId),
            eq(auditLog.action, ACTION),
            eq(auditLog.target, target),
          ),
        )
        .orderBy(desc(auditLog.createdAt))
        .limit(1);
      return {
        ok: false,
        conflict: latest
          ? { action: ACTION, by: latest.by ?? "알 수 없음", byId: latest.byId, at: latest.at }
          : null,
      };
    }
    if (from === to) return { ok: true };
    await tx
      .update(homebrewRules)
      .set({ scope: to })
      .where(eq(homebrewRules.rulebookId, rulebookId));
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: ACTION,
        target,
        reason: `${HOMEBREW_SCOPE_LABEL[from]}에서 ${HOMEBREW_SCOPE_LABEL[to]}으로`,
        before: { label: HOMEBREW_SCOPE_LABEL[from] },
        after: { label: HOMEBREW_SCOPE_LABEL[to] },
      },
    });
    return { ok: true };
  });
}
