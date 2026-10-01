import { sql } from "drizzle-orm";

import { profiles, serverMembers } from "../../../schema";

// RQB의 user·gm 관계에 extras로 붙인다. 소개는 서버별(server_members)이라 profiles 관계로는 못 읽는다.
// ponytail: inner alias "member" + raw column, else RQB re-aliases serverMembers columns to the relation's alias.
export function memberBioSql(serverId: string) {
  return sql<
    string | null
  >`(select "member"."bio" from ${serverMembers} "member" where "member"."server_id" = ${serverId} and "member"."user_id" = ${profiles.id})`.as(
    "bio",
  );
}
