import type { db } from "../../../client";
import { auditLog } from "../../../schema";
import type { Actor, AuditInput } from "../model/types";

export type Executor = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

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
    before: entry.before,
    after: entry.after,
    related: entry.related ?? [],
  });
}
