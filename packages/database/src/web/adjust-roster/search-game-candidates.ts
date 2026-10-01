import { and, eq } from "drizzle-orm";

import { db } from "../../client";
import { participants, profiles, serverMembers } from "../../schema";
import { memberSearchWhere } from "./member-search-where";

// 이 서버 멤버만 찾고, 이 게임에 이미 있는 사람은 상태를 함께 돌려준다.
export async function searchGameCandidates({
  serverId,
  gameId,
  excludeUserId,
  keyword,
  limit,
}: {
  serverId: string;
  gameId: string;
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
      status: participants.status,
    })
    .from(profiles)
    .innerJoin(
      serverMembers,
      and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, profiles.id)),
    )
    .leftJoin(
      participants,
      and(
        eq(participants.serverId, serverId),
        eq(participants.userId, profiles.id),
        eq(participants.gameId, gameId),
      ),
    )
    .where(memberSearchWhere({ excludeUserId, keyword }))
    .orderBy(profiles.username)
    .limit(limit);
}
