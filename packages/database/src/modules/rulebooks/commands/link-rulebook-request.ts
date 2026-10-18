import { and, eq, sql } from "drizzle-orm";

import { db } from "#db/client";
import { recordAudit } from "#db/modules/audit";
import { compactChanges, listChange } from "#db/modules/audit";
import type { Actor } from "#db/modules/audit";
import { relinkGames } from "#db/modules/rulebooks/commands/relink-games";
import type { RulebookActionResult } from "#db/modules/rulebooks/model/rulebook-action-result";
import { rulebookLabel } from "#db/modules/rulebooks/model/rulebook-label";
import { rulebooks } from "#db/schema";

import { claimRulebookRequest } from "./claim-rulebook-request";
import { resolveRequestSupplements } from "./resolve-request-supplements";

export interface RulebookLinkInput {
  rulebookId: string;
  addAlias: boolean;
}

export async function linkRulebookRequest({
  serverId,
  id,
  actor,
  input,
}: {
  serverId: string;
  id: string;
  actor: Actor;
  input: RulebookLinkInput;
}): Promise<RulebookActionResult> {
  return db.transaction(async (tx) => {
    const [rulebook] = await tx
      .select()
      .from(rulebooks)
      .where(and(eq(rulebooks.serverId, serverId), eq(rulebooks.id, input.rulebookId)));
    if (!rulebook) throw new Error("연결할 룰북을 찾을 수 없습니다");
    const claim = await claimRulebookRequest({
      executor: tx,
      serverId,
      id,
      actor,
      outcome: "linked",
    });
    if (!claim.ok) return claim;
    const label = rulebookLabel(rulebook);
    const aliasAdded =
      input.addAlias && claim.label !== label && !rulebook.aliases.includes(claim.label);
    if (aliasAdded) {
      await tx
        .update(rulebooks)
        .set({ aliases: sql`array_append(${rulebooks.aliases}, ${claim.label})` })
        .where(eq(rulebooks.id, rulebook.id));
    }
    await relinkGames({ executor: tx, serverId });
    await resolveRequestSupplements({
      executor: tx,
      serverId,
      requestId: id,
      requestName: claim.name,
      rulebook: { id: rulebook.id, name: rulebook.name },
    });
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "룰북 연결",
        target: `${claim.label} · ${label}`,
        reason: `${claim.requester}의 추가 요청을 기존 룰북으로 처리`,
        after: aliasAdded
          ? {
              label: "연결됨",
              changes: compactChanges([
                listChange("다른 이름", rulebook.aliases, [...rulebook.aliases, claim.label]),
              ]),
            }
          : undefined,
      },
    });
    return { ok: true };
  });
}
