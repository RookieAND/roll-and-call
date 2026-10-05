import { inArray } from "drizzle-orm";

import { db } from "#/client";
import { profiles } from "#/schema";

import { memberNicknameSql } from "./member-nickname-sql";

// 순위 줄에 쓸 사람들. 계정이 없는 id는 빠진다.
export async function getRecordPeople({
  serverId,
  userIds,
}: {
  serverId: string;
  userIds: readonly string[];
}) {
  if (userIds.length === 0) return [];
  return db
    .select({
      id: profiles.id,
      avatarUrl: profiles.avatarUrl,
      username: memberNicknameSql(serverId),
    })
    .from(profiles)
    .where(inArray(profiles.id, [...userIds]));
}
