import { and, eq, isNull, ne, sql } from "drizzle-orm";

import { db } from "#/client";
import type { Transaction } from "#/modules/transaction/transaction";
import { serverMembers } from "#/schema";

// 닉네임은 서버별이다. 같은 서버의 활동 중인 다른 멤버가 대소문자 없이 같은 닉네임을 쓰는지 본다.
export async function isNicknameTaken({
  transaction,
  serverId,
  userId,
  nickname,
}: {
  transaction?: Transaction;
  serverId: string;
  userId: string;
  nickname: string;
}) {
  const [other] = await (transaction ?? db)
    .select({ userId: serverMembers.userId })
    .from(serverMembers)
    .where(
      and(
        eq(serverMembers.serverId, serverId),
        isNull(serverMembers.deletedAt),
        ne(serverMembers.userId, userId),
        sql`lower(${serverMembers.nickname}) = lower(${nickname})`,
      ),
    )
    .limit(1);
  return Boolean(other);
}
