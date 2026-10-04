import { and, inArray } from "drizzle-orm";

import { db } from "#/client";
import type { Transaction } from "#/modules/transaction/transaction";
import { sanctions } from "#/schema";

import { activeSanctionWhere } from "./active-sanction-where";

// 활동 정지 조회는 이 함수와 findActiveSanction뿐이다. 명단 추가 거부(W04)·신청 거부(W02)·구인 등록 거부(W06)·안내 화면(W02·W05·W07·W13·W14)이 함께 쓴다. 다른 파일에서 같은 조회를 새로 만들지 않는다.
export async function listSanctionedUserIds({
  executor = db,
  serverId,
  userIds,
  now = new Date(),
}: {
  executor?: Transaction | typeof db;
  serverId: string;
  userIds: readonly string[];
  now?: Date;
}): Promise<string[]> {
  if (userIds.length === 0) return [];
  const rows = await executor
    .selectDistinct({ userId: sanctions.userId })
    .from(sanctions)
    .where(and(activeSanctionWhere({ serverId, now }), inArray(sanctions.userId, [...userIds])));
  return rows.map((row) => row.userId);
}
