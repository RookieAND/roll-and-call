import "server-only";
import { db } from "./mock-db";
import { recordAudit } from "./record-audit";
import type { RulebookActionResult } from "./rulebook-action-result";
import { rulebookLabel } from "./rulebook-label";

export async function hideRulebook(
  id: string,
  actor: string,
  reason: string,
): Promise<RulebookActionResult> {
  const rulebook = db.rulebooks.find((candidate) => candidate.id === id);
  if (!rulebook) throw new Error("룰북을 찾을 수 없습니다");
  const label = rulebookLabel(rulebook);
  if (rulebook.hidden) {
    const latest = db.auditLog.find(
      (entry) => entry.action === "룰북 숨김" && entry.target === label,
    );
    return {
      ok: false,
      conflict: latest ? { action: latest.action, by: latest.actor, at: latest.at } : null,
    };
  }
  rulebook.hidden = true;
  recordAudit({
    actor,
    action: "룰북 숨김",
    target: label,
    reason,
    before: { label: "사용 중" },
    after: { label: "숨김" },
  });
  return { ok: true };
}
