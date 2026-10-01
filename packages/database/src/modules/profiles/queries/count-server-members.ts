import { and, eq, inArray } from "drizzle-orm";

import { db } from "../../../client";
import { serverMembers } from "../../../schema";

export async function countServerMembers({
  serverId,
  userIds,
}: {
  serverId: string;
  userIds: string[];
}) {
  return db.$count(
    serverMembers,
    and(eq(serverMembers.serverId, serverId), inArray(serverMembers.userId, userIds)),
  );
}
