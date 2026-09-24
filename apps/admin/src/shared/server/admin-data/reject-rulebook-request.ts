import "server-only";
import { findRulebookRequest } from "./find-rulebook-request";
import { recordAudit } from "./record-audit";
import type { RulebookActionResult } from "./rulebook-action-result";

export async function rejectRulebookRequest(
  id: string,
  actor: string,
  input: { userReason: string; staffMemo: string },
): Promise<RulebookActionResult> {
  const { request, requester } = findRulebookRequest(id);
  if (request.processed) return { ok: false, conflict: request.processed };
  request.processed = { action: "추가 요청 반려", by: actor, at: new Date() };
  recordAudit({
    actor,
    action: "추가 요청 반려",
    target: `${request.name} · ${requester} 요청`,
    reason: input.userReason,
    staffMemo: input.staffMemo || undefined,
  });
  return { ok: true };
}
