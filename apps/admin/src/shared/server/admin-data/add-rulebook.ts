import "server-only";
import { db, rulebooks } from "@roll-and-call/database";

import { certPolicyLabel } from "./cert-policy-label";
import { recordAudit } from "./record-audit";
import { relinkGames } from "./relink-games";
import type { RulebookFields } from "./rulebook-fields";
import { rulebookLabel } from "./rulebook-label";
import { toRulebookValues } from "./rulebook-values";
import type { Actor } from "./types";

export type AddRulebookResult = { ok: true; id: string } | { ok: false; duplicate: true };

// 이름·판본이 같은 룰북은 유니크 인덱스가 막는다.
export async function addRulebook(
  fields: RulebookFields,
  actor: Actor,
  reason: string,
): Promise<AddRulebookResult> {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .insert(rulebooks)
      .values(await toRulebookValues(tx, fields))
      .onConflictDoNothing()
      .returning({ id: rulebooks.id });
    if (!row) return { ok: false, duplicate: true };
    await relinkGames(tx);
    await recordAudit(tx, actor, {
      action: "룰북 추가",
      target: rulebookLabel(fields),
      reason,
      after: { label: certPolicyLabel(fields.certRequired) },
    });
    return { ok: true, id: row.id };
  });
}
