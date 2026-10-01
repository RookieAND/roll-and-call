import { and, eq } from "drizzle-orm";

import { db } from "../../../client";
import { profiles, serverMembers } from "../../../schema";
import { memberSearchWhere } from "./member-search-where";

export async function searchMembers({
  serverId,
  excludeUserId,
  keyword,
  limit,
}: {
  serverId: string;
  excludeUserId: string;
  keyword: string;
  limit: number;
}) {
  return db
    .select({
      userId: profiles.id,
      username: profiles.username,
      avatarUrl: profiles.avatarUrl,
      bio: serverMembers.bio,
    })
    .from(profiles)
    .innerJoin(
      serverMembers,
      and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, profiles.id)),
    )
    .where(memberSearchWhere({ excludeUserId, keyword }))
    .orderBy(profiles.username)
    .limit(limit);
}
