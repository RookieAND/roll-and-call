import { and, eq } from "drizzle-orm";

import { db } from "../../../client";
import { rulebooks } from "../../../schema";
import { certPolicyLabel } from "../../certifications/model/cert-policy-label";
import { recordAudit } from "../../moderation/commands/record-audit";
import type { Actor } from "../../moderation/model/types";
import type { RulebookActionResult } from "../model/rulebook-action-result";
import type { RulebookFields } from "../model/rulebook-fields";
import { rulebookLabel } from "../model/rulebook-label";
import { relinkGames } from "../queries/relink-games";
import type { AddRulebookResult } from "./add-rulebook";
import { claimRulebookRequest } from "./claim-rulebook-request";
import { toRulebookValues } from "./rulebook-values";

export type ApproveRequestResult = RulebookActionResult | Extract<AddRulebookResult, { ok: false }>;

export async function approveRulebookRequest({
  serverId,
  id,
  actor,
  fields,
  reason,
}: {
  serverId: string;
  id: string;
  actor: Actor;
  fields: RulebookFields;
  reason: string;
}): Promise<ApproveRequestResult> {
  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select({ id: rulebooks.id })
      .from(rulebooks)
      .where(and(eq(rulebooks.name, fields.name), eq(rulebooks.edition, fields.edition)));
    if (existing) return { ok: false, duplicate: true };
    const claim = await claimRulebookRequest({
      executor: tx,
      serverId,
      id,
      actor,
      outcome: "added",
    });
    if (!claim.ok) return claim;
    await tx.insert(rulebooks).values(await toRulebookValues({ executor: tx, fields }));
    await relinkGames(tx);
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "룰북 추가",
        target: rulebookLabel(fields),
        reason: `${claim.requester}의 추가 요청 · ${reason}`,
        after: { label: certPolicyLabel(fields.certRequired) },
      },
    });
    return { ok: true };
  });
}
