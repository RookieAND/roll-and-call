import { and, asc, eq, isNull, sql } from "drizzle-orm";

import { db } from "#/client";
import { profiles, serverMembers } from "#/schema";

// 디스코드 서버 닉네임 맞추기(C01 작업 2)용. 활동 중인 멤버를 가입 순으로 읽는다.
// hasAccount가 false면 디스코드 구인글로 미리 만든 프로필이라 로그인한 적이 없다.
export async function listMembersForNicknameSync(serverId: string) {
  return db
    .select({
      userId: serverMembers.userId,
      discordId: profiles.discordId,
      nickname: serverMembers.nickname,
      joinedAt: serverMembers.joinedAt,
      hasAccount: sql<boolean>`exists (select 1 from auth.users u where u.id = ${serverMembers.userId})`,
    })
    .from(serverMembers)
    .innerJoin(profiles, eq(profiles.id, serverMembers.userId))
    .where(and(eq(serverMembers.serverId, serverId), isNull(serverMembers.deletedAt)))
    .orderBy(asc(serverMembers.joinedAt), asc(serverMembers.userId));
}

export type NicknameSyncMember = Awaited<ReturnType<typeof listMembersForNicknameSync>>[number];
