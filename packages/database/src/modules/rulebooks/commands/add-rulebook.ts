import { db } from "#/client";
import { certPolicyLabel } from "#/modules/certifications/model/cert-policy-label";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import type { Actor } from "#/modules/moderation/model/types";
import type { RulebookFields } from "#/modules/rulebooks/model/rulebook-fields";
import { rulebookLabel } from "#/modules/rulebooks/model/rulebook-label";
import { relinkGames } from "#/modules/rulebooks/queries/relink-games";
import { rulebooks } from "#/schema";

import { toRulebookValues } from "./rulebook-values";

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
    await relinkGames({ executor: tx, serverId });
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "룰북 추가",
        target: rulebookLabel(fields),
        reason,
        after: { label: certPolicyLabel(fields.certRequired) },
      },
    });
    return { ok: true, id: row.id };
  });
}
