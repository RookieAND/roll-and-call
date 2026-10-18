import { and, eq, ne } from "drizzle-orm";
import { isUndefined } from "es-toolkit";

import { db } from "#db/client";
import { recordAudit } from "#db/modules/audit";
import type { Actor } from "#db/modules/audit";
import { relinkGames } from "#db/modules/rulebooks/commands/relink-games";
import { renameGameSupplements } from "#db/modules/rulebooks/commands/rename-game-supplements";
import { rulebookChanges } from "#db/modules/rulebooks/model/rulebook-audit-changes";
import type { RulebookFields } from "#db/modules/rulebooks/model/rulebook-fields";
import { rulebookLabel } from "#db/modules/rulebooks/model/rulebook-label";
import { describeRulebook } from "#db/modules/rulebooks/queries/describe-rulebook";
import { rulebookCategories, rulebooks } from "#db/schema";

import { removeEmptyCategories } from "./remove-empty-categories";
import { toRulebookValues } from "./rulebook-values";

export type UpdateRulebookResult = { ok: true } | { ok: false; duplicate: true };

// 인증·신청·구인은 룰북을 id로 가리키므로 이름이 바뀌어도 따라 고칠 곳이 없다. 다른 이름만 구인에 다시 맞춘다.
// 구인 서플리먼트만 이름을 함께 저장하므로 이름이 바뀌면 따라 고친다.
export async function updateRulebook({
  serverId,
  id,
  fields,
  actor,
  reason,
}: {
  serverId: string;
  id: string;
  fields: RulebookFields;
  actor: Actor;
  reason: string;
}): Promise<UpdateRulebookResult> {
  return db.transaction(async (tx) => {
    const [rulebook] = await tx
      .select()
      .from(rulebooks)
      .where(and(eq(rulebooks.serverId, serverId), eq(rulebooks.id, id)));
    if (!rulebook) throw new Error("룰북을 찾을 수 없습니다");
    const [duplicate] = await tx
      .select({ id: rulebooks.id })
      .from(rulebooks)
      .where(
        and(
          eq(rulebooks.serverId, serverId),
          eq(rulebooks.name, fields.name),
          eq(rulebooks.edition, fields.edition),
          ne(rulebooks.id, id),
        ),
      );
    if (duplicate) return { ok: false, duplicate: true };
    const before = await describeRulebook({ executor: tx, serverId, id });
    const values = await toRulebookValues({ executor: tx, serverId, fields, selfId: id });
    await tx.update(rulebooks).set(values).where(eq(rulebooks.id, id));
    if (!isUndefined(fields.miniRule)) {
      await tx
        .update(rulebookCategories)
        .set({ miniRule: fields.miniRule })
        .where(eq(rulebookCategories.id, values.categoryId));
    }
    const pointsHere = and(eq(rulebooks.serverId, serverId), eq(rulebooks.supersedesId, id));
    await tx
      .update(rulebooks)
      .set({ supersedesId: null })
      .where(
        values.kind === "core"
          ? and(pointsHere, ne(rulebooks.categoryId, values.categoryId))
          : pointsHere,
      );
    await removeEmptyCategories({ executor: tx, serverId });
    await relinkGames({ executor: tx, serverId });
    if (values.name !== rulebook.name) {
      await renameGameSupplements({ executor: tx, serverId, rulebookId: id, name: values.name });
    }
    const changes = rulebookChanges(before, await describeRulebook({ executor: tx, serverId, id }));
    const label = rulebookLabel(fields);
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "룰북 수정",
        target: label,
        reason,
        after: changes.length > 0 ? { label: "수정됨", changes } : undefined,
      },
    });
    return { ok: true };
  });
}
