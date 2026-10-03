import { and, eq, ilike, ne, or } from "drizzle-orm";

import { profiles } from "#/schema";

// 닉네임 일부나 디스코드 ID 전체로 찾는다. 찾는 사람 자신은 뺀다.
export function memberSearchWhere({
  excludeUserId,
  keyword,
}: {
  excludeUserId: string;
  keyword: string;
}) {
  const pattern = `%${keyword.replace(/[\\%_]/g, "\\$&")}%`;
  return and(
    ne(profiles.id, excludeUserId),
    or(ilike(profiles.username, pattern), eq(profiles.discordId, keyword)),
  );
}
