import "server-only";
import { db } from "@roll-and-call/database";

import { claimRulebookRequest } from "./claim-rulebook-request";
import { recordAudit } from "./record-audit";
import type { RulebookActionResult } from "./rulebook-action-result";
import type { Actor } from "./types";

export async function rejectRulebookRequest(
  id: string,
  actor: Actor,
  input: { userReason: string; staffMemo: string },
): Promise<RulebookActionResult> {
  return db.transaction(async (tx) => {
    const claim = await claimRulebookRequest(tx, id, actor, "rejected");
    if (!claim.ok) return claim;
    await recordAudit(tx, actor, {
      action: "추가 요청 반려",
      target: `${claim.label} · ${claim.requester} 요청`,
      reason: input.userReason,
      staffMemo: input.staffMemo || undefined,
    });
    return { ok: true };
  });
}
