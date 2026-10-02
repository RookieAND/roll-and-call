import { and, eq, isNull } from "drizzle-orm";

import { db } from "../../../client";
import { serverMembers } from "../../../schema";

// 탈퇴(deleted_at)하지 않은 멤버십. 없으면 그 서버에 가입하지 않은 사람이다.
export async function getActiveMembership({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}) {
  const [membership] = await db
    .select()
    .from(serverMembers)
    .where(
      and(
        eq(serverMembers.serverId, serverId),
        eq(serverMembers.userId, userId),
        isNull(serverMembers.deletedAt),
      ),
    );
  return membership;
}
