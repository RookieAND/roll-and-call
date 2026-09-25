import "server-only";
import { db, rulebooks } from "@roll-and-call/database";
import { and, eq } from "drizzle-orm";

import type { AddRulebookResult } from "./add-rulebook";
import { certPolicyLabel } from "./cert-policy-label";
import { claimRulebookRequest } from "./claim-rulebook-request";
import { recordAudit } from "./record-audit";
import { relinkGames } from "./relink-games";
import type { RulebookActionResult } from "./rulebook-action-result";
import type { RulebookFields } from "./rulebook-fields";
import { rulebookLabel } from "./rulebook-label";
import { toRulebookValues } from "./rulebook-values";
import type { Actor } from "./types";

export type ApproveRequestResult = RulebookActionResult | Extract<AddRulebookResult, { ok: false }>;

// 운영진이 고친 이름·카테고리·종류로 새 룰북을 만든다. 이미 있는 룰북이면 요청을 처리하지 않고 돌려준다.
export async function approveRulebookRequest(
  id: string,
  actor: Actor,
  fields: RulebookFields,
  reason: string,
): Promise<ApproveRequestResult> {
  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: rulebooks.id })
      .from(rulebooks)
      .where(and(eq(rulebooks.name, fields.name), eq(rulebooks.edition, fields.edition)));
    if (existing) return { ok: false, duplicate: true };
    const claim = await claimRulebookRequest(tx, id, actor, "added");
    if (!claim.ok) return claim;
    await tx.insert(rulebooks).values(await toRulebookValues(tx, fields));
    await relinkGames(tx);
    await recordAudit(tx, actor, {
      action: "룰북 추가",
      target: rulebookLabel(fields),
      reason: `${claim.requester}의 추가 요청 · ${reason}`,
      after: { label: certPolicyLabel(fields.certRequired) },
    });
    return { ok: true };
  });
}
