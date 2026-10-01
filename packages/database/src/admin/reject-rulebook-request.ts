import { db } from "../client";
import { claimRulebookRequest } from "./claim-rulebook-request";
import { recordAudit } from "./record-audit";
import type { RulebookActionResult } from "./rulebook-action-result";
import type { Actor } from "./types";

export async function rejectRulebookRequest({
  serverId,
  id,
  actor,
  input,
}: {
  serverId: string;
  id: string;
  actor: Actor;
  input: { userReason: string; staffMemo: string };
}): Promise<RulebookActionResult> {
  return db.transaction(async (tx) => {
    const claim = await claimRulebookRequest({
      executor: tx,
      serverId,
      id,
      actor,
      outcome: "rejected",
    });
    if (!claim.ok) return claim;
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "추가 요청 반려",
        target: `${claim.label} · ${claim.requester} 요청`,
        reason: input.userReason,
        staffMemo: input.staffMemo || undefined,
      },
    });
    return { ok: true };
  });
}
