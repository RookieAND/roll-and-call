import "server-only";
import { auditLog, type db } from "@roll-and-call/database";

import type { Actor, AuditEntry } from "./types";

// db 자체나 db.transaction 안의 tx 모두 받는다.
export type Executor = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

interface AuditInput extends Omit<AuditEntry, "id" | "at" | "actor"> {
  targetGameId?: string;
}

// 확정한 조치는 모두 이 함수로 활동 기록 한 건을 남긴다. 조치와 같은 트랜잭션(tx)으로 넘긴다.
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
