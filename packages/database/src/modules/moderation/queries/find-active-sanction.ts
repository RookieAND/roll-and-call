import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "#/client";
import { reasonLabel } from "#/modules/moderation/model/reason-label";
import { USER_ACTION_REASON } from "#/modules/moderation/model/user-action-reason";
import type { Transaction } from "#/modules/transaction/transaction";
import { sanctions } from "#/schema";

import { activeSanctionWhere } from "./active-sanction-where";

// 활동 정지 조회는 이 함수와 listSanctionedUserIds뿐이다. 명단 추가 거부(W04)·신청 거부(W02)·구인 등록 거부(W06)·안내 화면(W02·W05·W07·W13·W14)이 함께 쓴다. 다른 파일에서 같은 조회를 새로 만들지 않는다.
// 여럿이면 가장 늦게 끝나는 것(무기한이 있으면 무기한)을 돌려준다.
export async function findActiveSanction({
  executor = db,
  serverId,
  userId,
  now = new Date(),
}: {
  executor?: Transaction | typeof db;
  serverId: string;
  userId: string;
  now?: Date;
}): Promise<{ reason: string; until: Date | null } | null> {
  const [row] = await executor
    .select({ code: sanctions.reasonCode, text: sanctions.reasonText, until: sanctions.until })
    .from(sanctions)
    .where(and(activeSanctionWhere({ serverId, now }), eq(sanctions.userId, userId)))
    .orderBy(sql`${sanctions.until} desc nulls first`, desc(sanctions.createdAt))
    .limit(1);
  if (!row) return null;
  return { reason: reasonLabel({ ...row, reasons: USER_ACTION_REASON }), until: row.until };
}
