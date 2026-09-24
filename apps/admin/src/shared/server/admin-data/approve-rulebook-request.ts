import "server-only";
import { db, rulebooks } from "@roll-and-call/database";

import { certPolicyLabel } from "./cert-policy-label";
import { claimRulebookRequest } from "./claim-rulebook-request";
import { recordAudit } from "./record-audit";
import { relinkGames } from "./relink-games";
import type { RulebookActionResult } from "./rulebook-action-result";
import type { Actor } from "./types";

// 요청한 이름 그대로 새 룰북을 만든다. 인증 정책은 안전한 쪽(인증 필요)으로 시작한다.
export async function approveRulebookRequest(
  id: string,
  actor: Actor,
): Promise<RulebookActionResult> {
  return db.transaction(async (tx) => {
    const claim = await claimRulebookRequest(tx, id, actor, "added");
    if (!claim.ok) return claim;
    await tx.insert(rulebooks).values({ name: claim.name }).onConflictDoNothing();
    await relinkGames(tx);
    await recordAudit(tx, actor, {
      action: "룰북 추가",
      target: claim.name,
      reason: `${claim.requester}의 추가 요청`,
      after: { label: certPolicyLabel(true) },
    });
    return { ok: true };
  });
}
