import { inArray } from "drizzle-orm";

import { db } from "#/client";
import { profiles } from "#/schema";

import { memberNicknameSql } from "./member-nickname-sql";

// 그 서버에서 보이는 닉네임 목록. 계정이 없는 id는 빠진다.
export async function getMemberNicknames({
  serverId,
  userIds,
}: {
  serverId: string;
  userIds: readonly string[];
}) {
  const rows = await db
    .select({ nickname: memberNicknameSql(serverId) })
    .from(profiles)
    .where(inArray(profiles.id, [...userIds]));
  return rows.map((row) => row.nickname);
}
