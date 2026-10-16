import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { serverMembers } from "#/schema";

export async function listRankingHiddenUserIds({ serverId }: { serverId: string }) {
  const rows = await db
    .select({ userId: serverMembers.userId })
    .from(serverMembers)
    .where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.hideFromRanking, true)));
  return rows.map((row) => row.userId);
}
