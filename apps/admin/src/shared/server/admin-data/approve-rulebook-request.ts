import "server-only";
import { certPolicyLabel } from "./cert-policy-label";
import { findRulebookRequest } from "./find-rulebook-request";
import { db } from "./mock-db";
import { recordAudit } from "./record-audit";
import type { RulebookActionResult } from "./rulebook-action-result";

// 요청한 이름 그대로 새 룰북을 만든다. 인증 정책은 안전한 쪽(인증 필요)으로 시작한다.
export async function approveRulebookRequest(
  id: string,
  actor: string,
): Promise<RulebookActionResult> {
  const { request, requester } = findRulebookRequest(id);
  if (request.processed) return { ok: false, conflict: request.processed };
  db.rulebooks.push({
    id: `b${db.rulebooks.length + 1}`,
    name: request.name,
    edition: "",
    aliases: [],
    certRequired: true,
    hidden: false,
  });
  request.processed = { action: "룰북 추가", by: actor, at: new Date() };
  recordAudit({
    actor,
    action: "룰북 추가",
    target: request.name,
    reason: `${requester}의 추가 요청`,
    after: { label: certPolicyLabel(true) },
  });
  return { ok: true };
}
