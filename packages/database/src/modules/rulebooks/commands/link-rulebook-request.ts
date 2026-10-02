import { and, eq, sql } from "drizzle-orm";

import { db } from "../../../client";
import { rulebooks } from "../../../schema";
import { recordAudit } from "../../moderation/commands/record-audit";
import type { Actor } from "../../moderation/model/types";
import type { RulebookActionResult } from "../model/rulebook-action-result";
import { rulebookLabel } from "../model/rulebook-label";
import { relinkGames } from "../queries/relink-games";
import { claimRulebookRequest } from "./claim-rulebook-request";

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
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "룰북 연결",
        target: `${claim.label} · ${label}`,
        reason: `${claim.requester}의 추가 요청을 기존 룰북으로 처리`,
        related: aliasAdded ? [`「${claim.label}」을 다른 이름에 추가`] : undefined,
      },
    });
    return { ok: true };
  });
}
