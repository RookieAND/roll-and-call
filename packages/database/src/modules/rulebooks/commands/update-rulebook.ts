import { and, eq, ne } from "drizzle-orm";

import { db } from "../../../client";
import { rulebooks } from "../../../schema";
import { certPolicyLabel } from "../../certifications/model/cert-policy-label";
import { recordAudit } from "../../moderation/commands/record-audit";
import type { Actor } from "../../moderation/model/types";
import type { RulebookFields } from "../model/rulebook-fields";
import { rulebookLabel } from "../model/rulebook-label";
import { relinkGames } from "../queries/relink-games";
import { removeEmptyCategories } from "./remove-empty-categories";
import { toRulebookValues } from "./rulebook-values";

// 인증·신청·구인은 룰북을 id로 가리키므로 이름이 바뀌어도 따라 고칠 곳이 없다. 다른 이름만 구인에 다시 맞춘다.
export async function updateRulebook({
  serverId,
  id,
  fields,
  actor,
  reason,
}: {
  serverId: string;
  id: string;
  fields: RulebookFields;
  actor: Actor;
  reason: string;
}) {
  await db.transaction(async (tx) => {
    const [rulebook] = await tx.select().from(rulebooks).where(eq(rulebooks.id, id));
    if (!rulebook) throw new Error("룰북을 찾을 수 없습니다");
    const values = await toRulebookValues({ executor: tx, fields, selfId: id });
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
    await recordAudit({
      executor: tx,
      serverId,
      actor,
      entry: {
        action: "룰북 수정",
        target: label,
        reason,
        before: { label: rulebookLabel(rulebook), sub: certPolicyLabel(rulebook.certRequired) },
        after: { label, sub: certPolicyLabel(fields.certRequired) },
      },
    });
  });
}
