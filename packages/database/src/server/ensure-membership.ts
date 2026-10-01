import { and, eq, isNull } from "drizzle-orm";

import { db } from "../client";
import { serverMembers } from "../schema";

// 처음 들어오면 멤버로 넣고, 나갔던 사람이면 deleted_at을 지워 예전 프로필을 되살린다.
export async function ensureMembership({ serverId, userId }: { serverId: string; userId: string }) {
  const [active] = await db
    .select({ userId: serverMembers.userId })
    .from(serverMembers)
    .where(
      and(
        eq(serverMembers.serverId, serverId),
        eq(serverMembers.userId, userId),
        isNull(serverMembers.deletedAt),
      ),
    );
  if (active) return;
  await db
    .insert(serverMembers)
    .values({ serverId, userId })
    .onConflictDoUpdate({
      target: [serverMembers.serverId, serverMembers.userId],
      set: { deletedAt: null },
    });
}
