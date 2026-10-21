import { db } from "#db/client";
import { recordAudit } from "#db/modules/audit";
import type { Actor } from "#db/modules/audit";
import { relinkGames } from "#db/modules/rulebooks/commands/relink-games";
import { rulebookChanges } from "#db/modules/rulebooks/model/rulebook-audit-changes";
import type { RulebookFields } from "#db/modules/rulebooks/model/rulebook-fields";
import { rulebookLabel } from "#db/modules/rulebooks/model/rulebook-label";
import { describeRulebook } from "#db/modules/rulebooks/queries/describe-rulebook";
import { rulebooks } from "#db/schema";

import { toRulebookValues } from "./rulebook-values";
import { saveIncludedSupplements } from "./save-included-supplements";

export type AddRulebookResult = { ok: true; id: string } | { ok: false; duplicate: true };

// 한 서버에서 이름·판본이 같은 룰북은 유니크 인덱스가 막는다.
export async function addRulebook({
  serverId,
  fields,
  actor,
  reason,
}: {
  serverId: string;
  fields: RulebookFields;
  actor: Actor;
  reason: string;
}): Promise<AddRulebookResult> {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .insert(rulebooks)
      .values(await toRulebookValues({ executor: tx, serverId, fields }))
      .onConflictDoNothing()
      .returning({ id: rulebooks.id });
    if (!row) return { ok: false, duplicate: true };
    await saveIncludedSupplements({
      executor: tx,
      serverId,
      coreId: row.id,
      supplementIds: fields.includedSupplementIds,
    });
    await relinkGames({ executor: tx, serverId });
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "룰북 추가",
        target: rulebookLabel(fields),
        reason,
        after: {
          label: "추가됨",
          changes: rulebookChanges(
            null,
            await describeRulebook({ executor: tx, serverId, id: row.id }),
          ),
        },
      },
    });
    return { ok: true, id: row.id };
  });
}
