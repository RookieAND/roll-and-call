import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { recordAudit } from "#/modules/moderation/commands/record-audit";
import type { Actor } from "#/modules/moderation/model/types";
import type { RulebookActionResult } from "#/modules/rulebooks/model/rulebook-action-result";
import { rulebookChanges } from "#/modules/rulebooks/model/rulebook-audit-changes";
import type { RulebookFields } from "#/modules/rulebooks/model/rulebook-fields";
import { rulebookLabel } from "#/modules/rulebooks/model/rulebook-label";
import { describeRulebook } from "#/modules/rulebooks/queries/describe-rulebook";
import { relinkGames } from "#/modules/rulebooks/queries/relink-games";
import { rulebooks } from "#/schema";

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
      .where(
        and(
          eq(rulebooks.serverId, serverId),
          eq(rulebooks.name, fields.name),
          eq(rulebooks.edition, fields.edition),
        ),
      );
    if (existing) return { ok: false, duplicate: true };
    const claim = await claimRulebookRequest({
      executor: tx,
      serverId,
      id,
      actor,
      outcome: "added",
    });
    if (!claim.ok) return claim;
    const [created] = await tx
      .insert(rulebooks)
      .values(await toRulebookValues({ executor: tx, serverId, fields }))
      .returning({ id: rulebooks.id });
    if (!created) throw new Error("룰북을 만들지 못했습니다");
    await relinkGames({ executor: tx, serverId });
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "룰북 추가",
        target: rulebookLabel(fields),
        reason: `${claim.requester}의 추가 요청 · ${reason}`,
        after: {
          label: "추가됨",
          changes: rulebookChanges(
            null,
            await describeRulebook({ executor: tx, serverId, id: created.id }),
          ),
        },
      },
    });
    return { ok: true };
  });
}
