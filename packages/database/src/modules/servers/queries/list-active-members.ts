import { and, eq, isNull } from "drizzle-orm";

import { db } from "../../../client";
import { profiles, serverMembers } from "../../../schema";

// 탈퇴하지 않은 멤버의 디스코드 ID. 하루 한 번 디스코드 서버를 나간 사람을 맞추는 데 쓴다.
export async function listActiveMembers(serverId: string) {
  return db
    .select({ userId: serverMembers.userId, discordId: profiles.discordId })
    .from(serverMembers)
    .innerJoin(profiles, eq(profiles.id, serverMembers.userId))
    .where(and(eq(serverMembers.serverId, serverId), isNull(serverMembers.deletedAt)));
}
