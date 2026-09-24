import "server-only";
import { certPolicyLabel } from "./cert-policy-label";
import { db } from "./mock-db";
import { recordAudit } from "./record-audit";
import type { RulebookFields } from "./rulebook-fields";
import { rulebookLabel } from "./rulebook-label";

// 인증·신청·구인은 룰북을 글자로 가리키므로, 이름이나 판본이 바뀌면 함께 고친다.
export async function updateRulebook(
  id: string,
  fields: RulebookFields,
  actor: string,
  reason: string,
) {
  const rulebook = db.rulebooks.find((candidate) => candidate.id === id);
  if (!rulebook) throw new Error("룰북을 찾을 수 없습니다");
  const previousLabel = rulebookLabel(rulebook);
  const before = { label: previousLabel, sub: certPolicyLabel(rulebook.certRequired) };
  Object.assign(rulebook, fields);
  const label = rulebookLabel(rulebook);
  if (label !== previousLabel) {
    for (const item of [...db.certifications, ...db.certApplications, ...db.sessions]) {
      if (item.rulebook === previousLabel) item.rulebook = label;
    }
  }
  recordAudit({
    actor,
    action: "룰북 수정",
    target: label,
    reason,
    before,
    after: { label, sub: certPolicyLabel(rulebook.certRequired) },
  });
}
