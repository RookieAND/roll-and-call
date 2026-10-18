import { eq } from "drizzle-orm";

import { db } from "#db/client";
import type { Actor } from "#db/modules/audit";
import { removedChanges } from "#db/modules/audit";
import { recordAudit } from "#db/modules/audit";
import { staffMemos } from "#db/schema";

import { lockStaffMemo, type StaffMemoChangeResult } from "./lock-staff-memo";

// owner는 서버 소유자(플랫폼 관리자 포함)다. 쓴 사람도 소유자도 아니면 아무것도 지우지 않는다.
export async function deleteStaffMemo({
  serverId,
  memoId,
  actor,
  owner,
}: {
  serverId: string;
  memoId: string;
  actor: Actor;
  owner: boolean;
}): Promise<StaffMemoChangeResult> {
  return db.transaction(async (transaction) => {
    const memo = await lockStaffMemo({ transaction, serverId, memoId, actor, owner });
    if (!memo.ok) return memo;
    await transaction.delete(staffMemos).where(eq(staffMemos.id, memoId));
    await recordAudit({
      executor: transaction,
      serverId,
      actor,
      entry: {
        action: "운영진 메모",
        target: memo.nickname,
        targetUserId: memo.userId,
        reason: "메모 지움",
        after: { label: "지움", changes: removedChanges([["메모", memo.body]]) },
      },
    });
    return { ok: true };
  });
}
