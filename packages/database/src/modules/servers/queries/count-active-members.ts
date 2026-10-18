import { and, eq, isNull } from "drizzle-orm";

import { db } from "#db/client";
import { serverMembers } from "#db/schema";

export async function countActiveMembers(serverId: string) {
  return db.$count(
    serverMembers,
    and(eq(serverMembers.serverId, serverId), isNull(serverMembers.deletedAt)),
  );
}
