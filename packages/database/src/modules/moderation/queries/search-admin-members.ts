import { and, asc, eq, sql } from "drizzle-orm";

import { db } from "#db/client";
import { profiles, serverMembers } from "#db/schema";

// 닉네임에 글자가 든 멤버(나간·차단된 멤버 포함). 대소문자를 무시하고 정확히 같음 → 앞부분 일치 → 부분 일치 순이다.
export function searchAdminMembers({
  serverId,
  keyword,
  limit,
}: {
  serverId: string;
  keyword: string;
  limit: number;
}) {
  const nickname = sql`lower(${serverMembers.nickname})`;
  const query = sql`lower(${keyword}::text)`;
  return db
    .select({ id: profiles.id, nickname: serverMembers.nickname })
    .from(profiles)
    .innerJoin(
      serverMembers,
      and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, profiles.id)),
    )
    .where(sql`strpos(${nickname}, ${query}) > 0`)
    .orderBy(
      sql`case when ${nickname} = ${query} then 0 when starts_with(${nickname}, ${query}) then 1 else 2 end`,
      asc(profiles.createdAt),
      asc(profiles.id),
    )
    .limit(limit);
}
