import "server-only";
import { auditLog, type db } from "@roll-and-call/database";

import type { Actor, AuditEntry } from "./types";

export type Executor = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

interface AuditInput extends Omit<AuditEntry, "id" | "at" | "actor"> {
  targetGameId?: string;
}

// 조치와 같은 트랜잭션(tx)으로 넘긴다.
export async function recordAudit(executor: Executor, actor: Actor, entry: AuditInput) {
  await executor.insert(auditLog).values({
    actorId: actor.id,
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
