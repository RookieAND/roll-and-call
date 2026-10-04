import { sql } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

import { profiles, serverMembers } from "#/schema";

// 그 서버에서 보이는 닉네임(server_members.nickname, 나간 멤버 포함). 멤버십이 없으면 계정 이름으로 대신한다.
// RQB의 user·gm 관계에 extras로 붙이거나 select에 쓴다. 별칭 profiles(alias(profiles, "gm"))면 그 별칭을 넘긴다.
// ponytail: 안쪽 별칭 "member"를 고정해 RQB가 관계 별칭으로 바꿔 쓰지 않게 한다. 계정 칸은 바깥 것을 그대로 읽는다:
// 한 표만 읽는 쿼리는 칸 이름을 테이블 없이("id") 적어서, 안쪽에 profiles를 두면 그쪽 id로 잡힌다.
export function memberNicknameSql(
  serverId: string,
  account: { id: AnyPgColumn; username: AnyPgColumn } = profiles,
) {
  return sql<string>`coalesce(
    (select "member"."nickname" from ${serverMembers} "member" where "member"."server_id" = ${serverId} and "member"."user_id" = ${account.id}),
    ${account.username}
  )`.as("username");
}
