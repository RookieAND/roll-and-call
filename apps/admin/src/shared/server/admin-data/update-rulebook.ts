import "server-only";
import { db, rulebooks } from "@roll-and-call/database";
import { eq } from "drizzle-orm";

import { certPolicyLabel } from "./cert-policy-label";
import { recordAudit } from "./record-audit";
import { relinkGames } from "./relink-games";
import type { RulebookFields } from "./rulebook-fields";
import { rulebookLabel } from "./rulebook-label";
import type { Actor } from "./types";

// 인증·신청·구인은 룰북을 id로 가리키므로 이름이 바뀌어도 따라 고칠 곳이 없다. 다른 이름만 구인에 다시 맞춘다.
export async function updateRulebook(
  id: string,
  fields: RulebookFields,
  actor: Actor,
  reason: string,
) {
  await db.transaction(async (tx) => {
    const [rulebook] = await tx.select().from(rulebooks).where(eq(rulebooks.id, id));
    if (!rulebook) throw new Error("룰북을 찾을 수 없습니다");
    await tx.update(rulebooks).set(fields).where(eq(rulebooks.id, id));
    await relinkGames(tx);
    const label = rulebookLabel(fields);
    await recordAudit(tx, actor, {
      action: "룰북 수정",
      target: label,
      reason,
      before: { label: rulebookLabel(rulebook), sub: certPolicyLabel(rulebook.certRequired) },
      after: { label, sub: certPolicyLabel(fields.certRequired) },
    });
  });
}
