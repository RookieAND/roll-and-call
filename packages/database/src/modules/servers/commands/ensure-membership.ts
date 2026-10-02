import { and, eq, isNull } from "drizzle-orm";

import { db } from "../../../client";
import { serverMembers } from "../../../schema";

// 처음 들어오면 멤버로 넣고, 나갔던 사람이면 deleted_at을 지워 예전 프로필을 되살린다.
// 추방되어 차단(banned_at) 중인 사람은 넣지 않고 false를 돌려준다. 차단이 풀리면 일반 재가입이다.
export async function ensureMembership({ serverId, userId }: { serverId: string; userId: string }) {
  const [existing] = await db
    .select({ deletedAt: serverMembers.deletedAt, bannedAt: serverMembers.bannedAt })
    .from(serverMembers)
    .where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, userId)));
  if (existing?.bannedAt) return false;
  if (existing && !existing.deletedAt) return true;
  const joined = await db
    .insert(serverMembers)
    .values({ serverId, userId })
    .onConflictDoUpdate({
      target: [serverMembers.serverId, serverMembers.userId],
      set: { deletedAt: null },
      setWhere: isNull(serverMembers.bannedAt),
    })
    .returning({ userId: serverMembers.userId });
  return joined.length > 0;
}
