import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import type { Actor } from "#/modules/moderation/model/types";
import { claimRulebookRequest } from "#/modules/rulebooks/commands/claim-rulebook-request";
import type { RulebookActionResult } from "#/modules/rulebooks/model/rulebook-action-result";
import { rulebookRequests } from "#/schema";

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
    await tx
      .update(rulebookRequests)
      .set({ rejectReason: input.userReason.trim() || null })
      .where(and(eq(rulebookRequests.serverId, serverId), eq(rulebookRequests.id, id)));
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
