import { and, eq, inArray } from "drizzle-orm";

import { db } from "#db/client";
import { profiles, serverMembers } from "#db/schema";

import { isUuid } from "./is-uuid";

// 그 서버 멤버(나간·차단된 멤버 포함)의 닉네임. 멤버가 아니면 빠진다.
export async function listAdminMemberNicknames({
  serverId,
  userIds,
}: {
  serverId: string;
  userIds: readonly string[];
}) {
  const ids = userIds.filter(isUuid);
  if (ids.length === 0) return [];
  return db
    .select({ id: profiles.id, nickname: serverMembers.nickname })
    .from(profiles)
    .innerJoin(
      serverMembers,
      and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, profiles.id)),
    )
    .where(inArray(profiles.id, ids));
}
