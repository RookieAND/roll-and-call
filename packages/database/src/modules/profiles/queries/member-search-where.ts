import { and, eq, ilike, ne, or } from "drizzle-orm";

import { profiles, serverMembers } from "#/schema";

// 이 서버 닉네임 일부나 디스코드 ID 전체로 찾는다. 찾는 사람 자신은 뺀다. 부르는 쪽이 server_members를 join한다.
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
    or(ilike(serverMembers.nickname, pattern), eq(profiles.discordId, keyword)),
  );
}
