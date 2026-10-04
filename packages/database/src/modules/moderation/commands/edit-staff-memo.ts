import { eq } from "drizzle-orm";

import { db } from "#/client";
import type { Actor } from "#/modules/moderation/model/types";
import { staffMemos } from "#/schema";

import { lockStaffMemo, type StaffMemoChangeResult } from "./lock-staff-memo";
import { recordAudit } from "./record-audit";

// owner는 서버 소유자(플랫폼 관리자 포함)다. 쓴 사람도 소유자도 아니면 아무것도 바꾸지 않는다.
export async function editStaffMemo({
  serverId,
  memoId,
  actor,
  owner,
  body,
}: {
  serverId: string;
  memoId: string;
  actor: Actor;
  owner: boolean;
  body: string;
}): Promise<StaffMemoChangeResult> {
  return db.transaction(async (transaction) => {
    const memo = await lockStaffMemo({ transaction, serverId, memoId, actor, owner });
    if (!memo.ok) return memo;
    await transaction.update(staffMemos).set({ body }).where(eq(staffMemos.id, memoId));
    await recordAudit({
      executor: transaction,
      serverId,
      actor,
      entry: {
        action: "운영진 메모",
        target: memo.nickname,
        targetUserId: memo.userId,
        reason: "메모 고침",
      },
    });
    return { ok: true };
  });
}
