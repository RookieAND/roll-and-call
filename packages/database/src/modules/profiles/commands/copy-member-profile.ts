import { and, eq, isNull } from "drizzle-orm";

import { db } from "../../../client";
import { serverMembers } from "../../../schema";

// 다른 서버의 소개·성향·링크·기본 가능 시간만 옮긴다. 기록·뱃지·인증은 서버마다 따로다.
export async function copyMemberProfile({
  serverId,
  userId,
  fromServerId,
}: {
  serverId: string;
  userId: string;
  fromServerId: string;
}) {
  const [source] = await db
    .select({
      bio: serverMembers.bio,
      keywords: serverMembers.keywords,
      links: serverMembers.links,
      availability: serverMembers.availability,
    })
    .from(serverMembers)
    .where(
      and(
        eq(serverMembers.serverId, fromServerId),
        eq(serverMembers.userId, userId),
        isNull(serverMembers.deletedAt),
      ),
    );
  if (!source) return false;
  await db
    .update(serverMembers)
    .set(source)
    .where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, userId)));
  return true;
}
