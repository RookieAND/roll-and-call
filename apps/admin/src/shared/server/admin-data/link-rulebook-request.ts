import "server-only";
import { db, rulebooks } from "@roll-and-call/database";
import { eq, sql } from "drizzle-orm";

import { claimRulebookRequest } from "./claim-rulebook-request";
import { recordAudit } from "./record-audit";
import { relinkGames } from "./relink-games";
import type { RulebookActionResult } from "./rulebook-action-result";
import { rulebookLabel } from "./rulebook-label";
import type { Actor } from "./types";

export interface RulebookLinkInput {
  rulebookId: string;
  addAlias: boolean;
}

// 요청을 이미 있는 룰북으로 처리한다. 요청한 이름이 이미 그 룰북의 이름이면 다른 이름에 넣지 않는다.
export async function linkRulebookRequest(
  id: string,
  actor: Actor,
  input: RulebookLinkInput,
): Promise<RulebookActionResult> {
  return db.transaction(async (tx) => {
    const [rulebook] = await tx.select().from(rulebooks).where(eq(rulebooks.id, input.rulebookId));
    if (!rulebook) throw new Error("연결할 룰북을 찾을 수 없습니다");
    const claim = await claimRulebookRequest(tx, id, actor, "linked");
    if (!claim.ok) return claim;
    const label = rulebookLabel(rulebook);
    const aliasAdded =
      input.addAlias && claim.name !== label && !rulebook.aliases.includes(claim.name);
    if (aliasAdded) {
      await tx
        .update(rulebooks)
        .set({ aliases: sql`array_append(${rulebooks.aliases}, ${claim.name})` })
        .where(eq(rulebooks.id, rulebook.id));
    }
    await relinkGames(tx);
    await recordAudit(tx, actor, {
      action: "룰북 연결",
      target: `${claim.name} · ${label}`,
      reason: `${claim.requester}의 추가 요청을 기존 룰북으로 처리`,
      related: aliasAdded ? [`「${claim.name}」을 다른 이름에 추가`] : undefined,
    });
    return { ok: true };
  });
}
