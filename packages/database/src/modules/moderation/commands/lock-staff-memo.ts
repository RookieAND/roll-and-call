import { and, eq } from "drizzle-orm";

import type { Actor } from "#db/modules/audit";
import { memberNicknameSql } from "#db/modules/profiles";
import type { Transaction } from "#db/modules/transaction";
import { profiles, staffMemos } from "#db/schema";

import { canManageStaffMemo } from "../model/can-manage-staff-memo";

export type StaffMemoChangeResult = { ok: true } | { ok: false; reason: "notFound" | "forbidden" };

// 고치기·지우기 전에 메모 행을 잠그고 권한을 본다. 대상 닉네임은 활동 기록에 쓴다.
export async function lockStaffMemo({
  transaction,
  serverId,
  memoId,
  actor,
  owner,
}: {
  transaction: Transaction;
  serverId: string;
  memoId: string;
  actor: Actor;
  owner: boolean;
}) {
  const [memo] = await transaction
    .select({ userId: staffMemos.userId, authorId: staffMemos.authorId, body: staffMemos.body })
    .from(staffMemos)
    .where(and(eq(staffMemos.id, memoId), eq(staffMemos.serverId, serverId)))
    .for("update");
  if (!memo) return { ok: false as const, reason: "notFound" as const };
  if (!canManageStaffMemo({ authorId: memo.authorId, actorId: actor.id, owner })) {
    return { ok: false as const, reason: "forbidden" as const };
  }
  const [user] = await transaction
    .select({ nickname: memberNicknameSql(serverId) })
    .from(profiles)
    .where(eq(profiles.id, memo.userId));
  return {
    ok: true as const,
    userId: memo.userId,
    body: memo.body,
    nickname: user?.nickname ?? "",
  };
}
