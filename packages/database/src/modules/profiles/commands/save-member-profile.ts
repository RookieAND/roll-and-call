import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { profiles, serverMembers, type ProfileKeyword, type ProfileLink } from "#/schema";

// 닉네임은 계정(profiles)에, 소개·성향·링크는 이 서버의 프로필(server_members)에 쓴다.
export async function saveMemberProfile({
  serverId,
  userId,
  username,
  bio,
  keywords,
  links,
}: {
  serverId: string;
  userId: string;
  username: string;
  bio: string | null;
  keywords: ProfileKeyword[];
  links: ProfileLink[];
}) {
  await db.transaction(async (transaction) => {
    await transaction.update(profiles).set({ username }).where(eq(profiles.id, userId));
    await transaction
      .update(serverMembers)
      .set({ bio, keywords, links })
      .where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, userId)));
  });
}
