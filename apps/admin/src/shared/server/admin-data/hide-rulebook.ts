import "server-only";
import { auditLog, db, profiles, rulebooks } from "@roll-and-call/database";
import { and, desc, eq } from "drizzle-orm";

import { recordAudit } from "./record-audit";
import type { RulebookActionResult } from "./rulebook-action-result";
import { rulebookLabel } from "./rulebook-label";
import type { Actor } from "./types";

export async function hideRulebook(
  id: string,
  actor: Actor,
  reason: string,
): Promise<RulebookActionResult> {
  return db.transaction(async (tx) => {
    const [rulebook] = await tx.select().from(rulebooks).where(eq(rulebooks.id, id));
    if (!rulebook) throw new Error("룰북을 찾을 수 없습니다");
    const label = rulebookLabel(rulebook);
    const hidden = await tx
      .update(rulebooks)
      .set({ hidden: true })
      .where(and(eq(rulebooks.id, id), eq(rulebooks.hidden, false)))
      .returning({ id: rulebooks.id });
    if (hidden.length === 0) {
      const [latest] = await tx
        .select({ at: auditLog.createdAt, by: profiles.username })
        .from(auditLog)
        .leftJoin(profiles, eq(profiles.id, auditLog.actorId))
        .where(and(eq(auditLog.action, "룰북 숨김"), eq(auditLog.target, label)))
        .orderBy(desc(auditLog.createdAt))
        .limit(1);
      return {
        ok: false,
        conflict: latest
          ? { action: "룰북 숨김", by: latest.by ?? "알 수 없음", at: latest.at }
          : null,
      };
    }
    await recordAudit(tx, actor, {
      action: "룰북 숨김",
      target: label,
      reason,
      before: { label: "사용 중" },
      after: { label: "숨김" },
    });
    return { ok: true };
  });
}
