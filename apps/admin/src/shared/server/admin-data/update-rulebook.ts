import "server-only";
import { db, rulebooks } from "@roll-and-call/database";
import { and, eq, ne } from "drizzle-orm";

import { certPolicyLabel } from "./cert-policy-label";
import { recordAudit } from "./record-audit";
import { relinkGames } from "./relink-games";
import { removeEmptyCategories } from "./remove-empty-categories";
import type { RulebookFields } from "./rulebook-fields";
import { rulebookLabel } from "./rulebook-label";
import { toRulebookValues } from "./rulebook-values";
import type { Actor } from "./types";

// 인증·신청·구인은 룰북을 id로 가리키므로 이름이 바뀌어도 따라 고칠 곳이 없다. 다른 이름만 구인에 다시 맞춘다.
// 이 책이 기본 룰북에서 빠지거나 카테고리를 옮기면, 이 책을 구판으로 가리키던 연결을 끊는다.
export async function updateRulebook(
  id: string,
  fields: RulebookFields,
  actor: Actor,
  reason: string,
) {
  await db.transaction(async (tx) => {
    const [rulebook] = await tx.select().from(rulebooks).where(eq(rulebooks.id, id));
    if (!rulebook) throw new Error("룰북을 찾을 수 없습니다");
    const values = await toRulebookValues(tx, fields, id);
    await tx.update(rulebooks).set(values).where(eq(rulebooks.id, id));
    const pointsHere = eq(rulebooks.supersedesId, id);
    await tx
      .update(rulebooks)
      .set({ supersedesId: null })
      .where(
        values.kind === "core"
          ? and(pointsHere, ne(rulebooks.categoryId, values.categoryId))
          : pointsHere,
      );
    await removeEmptyCategories(tx);
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
