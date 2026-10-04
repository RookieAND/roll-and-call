import { and, eq, notInArray } from "drizzle-orm";

import { db } from "#/client";
import { activeSanctionWhere } from "#/modules/moderation/queries/active-sanction-where";
import { memberSearchWhere } from "#/modules/profiles/queries/member-search-where";
import { participants, profiles, sanctions, serverMembers } from "#/schema";

// 이 서버 멤버만 찾고, 이 게임에 이미 있는 사람은 상태를 함께 돌려준다. 활동 정지 중인 사람은 빼고 찾는다.
export async function searchGameCandidates({
  serverId,
  gameId,
  excludeUserId,
  keyword,
  limit,
  now = new Date(),
}: {
  serverId: string;
  gameId: string;
  excludeUserId: string;
  keyword: string;
  limit: number;
  now?: Date;
}) {
  return db
    .select({
      userId: profiles.id,
      username: serverMembers.nickname,
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
    .where(
      and(
        memberSearchWhere({ excludeUserId, keyword }),
        notInArray(
          profiles.id,
          db
            .select({ userId: sanctions.userId })
            .from(sanctions)
            .where(activeSanctionWhere({ serverId, now })),
        ),
      ),
    )
    .orderBy(serverMembers.nickname)
    .limit(limit);
}
