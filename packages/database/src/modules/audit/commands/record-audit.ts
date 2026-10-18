import type { Executor } from "#db/modules/transaction";
import { auditLog } from "#db/schema";

import { statesFromChanges } from "../model/states-from-changes";
import type { Actor, AuditInput } from "../model/types";

// 조치와 같은 트랜잭션(tx)으로 넘긴다. actor가 null이면 시스템 조치다.
export async function recordAudit({
  executor,
  serverId,
  actor,
  entry,
}: {
  executor: Executor;
  serverId: string;
  actor: Actor | null;
  entry: AuditInput;
}) {
  const changes = entry.after?.changes;
  const derived =
    !entry.before && entry.after && changes?.length
      ? statesFromChanges({ changes, afterLabel: entry.after.label, target: entry.target })
      : null;
  await executor.insert(auditLog).values({
    serverId,
    actorId: actor?.id ?? null,
    actorKind: actor?.kind ?? "system",
    action: entry.action,
    target: entry.target,
    targetUserId: entry.targetUserId,
    targetGameId: entry.targetGameId,
    reason: entry.reason,
    reasonTag: entry.reasonTag,
    staffMemo: entry.staffMemo,
    before: entry.before ?? derived?.before,
    after: derived ? { ...derived.after, changes } : entry.after,
    related: entry.related ?? [],
  });
}
