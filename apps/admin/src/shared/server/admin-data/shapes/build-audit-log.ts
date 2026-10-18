import { auditActionLabel } from "@roll-and-call/database/audit/model";
import { rulebookLabel } from "@roll-and-call/database/rulebooks/model";

import type { AuditEntry } from "../types";
import type { ShapeContext } from "./shape-context";

export function buildAuditLog({ tables, nicknameOf, shape }: ShapeContext): AuditEntry[] {
  // 같은 후기가 여럿이면 먼저 나온 것을 쓴다.
  const reviewIdOf = new Map<string, string>();
  for (const review of shape("reviews")) {
    const key = `${review.sessionId}:${review.authorId}`;
    if (!reviewIdOf.has(key)) reviewIdOf.set(key, review.id);
  }
  const rulebookIdOf = new Map(
    tables.rulebookRows.map((rulebook) => [rulebookLabel(rulebook), rulebook.id]),
  );
  return tables.auditRows
    .toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((row) => ({
      id: row.id,
      at: row.createdAt,
      actor: row.actorKind === "system" ? "시스템" : nicknameOf(row.actorId),
      actorId: row.actorId ?? undefined,
      actorKind: row.actorKind,
      action: auditActionLabel(row.action),
      target: row.target,
      targetUserId: row.targetUserId ?? undefined,
      targetGameId: row.targetGameId ?? undefined,
      reviewId: row.action.startsWith("후기")
        ? reviewIdOf.get(`${row.targetGameId}:${row.targetUserId}`)
        : undefined,
      rulebookId: row.target
        .split(" · ")
        .map((part) => rulebookIdOf.get(part))
        .find(Boolean),
      reason: row.reason,
      reasonTag: row.reasonTag ?? undefined,
      staffMemo: row.staffMemo ?? undefined,
      before: row.before ?? undefined,
      after: row.after ?? undefined,
      related: row.related.length ? row.related : undefined,
    }));
}
