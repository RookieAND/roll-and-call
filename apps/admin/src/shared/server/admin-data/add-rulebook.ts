import "server-only";
import { certPolicyLabel } from "./cert-policy-label";
import { db } from "./mock-db";
import { recordAudit } from "./record-audit";
import type { RulebookFields } from "./rulebook-fields";
import { rulebookLabel } from "./rulebook-label";

export type AddRulebookResult = { ok: true; id: string } | { ok: false; duplicate: true };

export async function addRulebook(
  fields: RulebookFields,
  actor: string,
  reason: string,
): Promise<AddRulebookResult> {
  const label = rulebookLabel(fields);
  if (db.rulebooks.some((rulebook) => rulebookLabel(rulebook) === label)) {
    return { ok: false, duplicate: true };
  }
  const id = `b${db.rulebooks.length + 1}`;
  db.rulebooks.push({ id, ...fields, hidden: false });
  recordAudit({
    actor,
    action: "룰북 추가",
    target: label,
    reason,
    after: { label: certPolicyLabel(fields.certRequired) },
  });
  return { ok: true, id };
}
