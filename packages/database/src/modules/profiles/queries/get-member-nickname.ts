import { eq } from "drizzle-orm";

import { db } from "#/client";
import type { Transaction } from "#/modules/transaction/transaction";
import { profiles } from "#/schema";

import { memberNicknameSql } from "./member-nickname-sql";

// 그 서버에서 보이는 닉네임. 계정이 없으면 undefined.
export async function getMemberNickname({
  executor = db,
  serverId,
  userId,
}: {
  executor?: Transaction | typeof db;
  serverId: string;
  userId: string;
}) {
  const [row] = await executor
    .select({ nickname: memberNicknameSql(serverId) })
    .from(profiles)
    .where(eq(profiles.id, userId));
  return row?.nickname;
}
