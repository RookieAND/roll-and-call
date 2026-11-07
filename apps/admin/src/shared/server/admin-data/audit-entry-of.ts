import { auditActionLabel } from "@roll-and-call/database/audit/model";
import type { AdminAuditRow } from "@roll-and-call/database/moderation";

import { MISSING_NAME, SYSTEM_ACTOR_NAME } from "./actor-names";
import type { AuditEntry } from "./types";

// rulebookIdOf는 룰북 이름(rulebookLabel) → ID다. 대상 글자의 「 · 」 조각 중 처음 맞는 룰북을 쓴다.
export function auditEntryOf({
  row,
  rulebookIdOf,
}: {
  row: AdminAuditRow;
  rulebookIdOf: Map<string, string>;
}): AuditEntry {
  return {
    id: row.id,
    at: row.createdAt,
    actor: row.actorKind === "system" ? SYSTEM_ACTOR_NAME : (row.actorNickname ?? MISSING_NAME),
    actorId: row.actorId ?? undefined,
    actorKind: row.actorKind,
    action: auditActionLabel(row.action),
    target: row.target,
    targetUserId: row.targetUserId ?? undefined,
    targetGameId: row.targetGameId ?? undefined,
    reviewId: row.reviewId ?? undefined,
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
  };
}
