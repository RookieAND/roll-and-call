import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { profiles, serverMembers } from "#/schema";

// 계정(profiles)에 이 서버에서 보이는 프로필(server_members)을 붙인다. 이 서버 멤버였던 적이 없으면 없는 사람으로 본다. 나간 멤버도 돌려주고(deletedAt) 화면이 가른다.
export async function findMemberProfile({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}) {
  const [profile] = await db
    .select({
      id: profiles.id,
      discordId: profiles.discordId,
      username: serverMembers.nickname,
      nicknameSuffixBase: serverMembers.nicknameSuffixBase,
      joinedAt: serverMembers.joinedAt,
      rejoinedAt: serverMembers.rejoinedAt,
      deletedAt: serverMembers.deletedAt,
      avatarUrl: profiles.avatarUrl,
      createdAt: profiles.createdAt,
      onboardedAt: profiles.onboardedAt,
      bio: serverMembers.bio,
      keywords: serverMembers.keywords,
      availability: serverMembers.availability,
      links: serverMembers.links,
      showGmBadge: serverMembers.showGmBadge,
      showBadges: serverMembers.showBadges,
      featuredBadges: serverMembers.featuredBadges,
    })
    .from(profiles)
    .innerJoin(
      serverMembers,
      and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, profiles.id)),
    )
    .where(eq(profiles.id, userId));
  return profile;
}

export type MemberProfile = NonNullable<Awaited<ReturnType<typeof findMemberProfile>>>;
