import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { serverMembers, type AvailabilityInterval } from "#/schema";

export async function saveMemberAvailability({
  serverId,
  userId,
  availability,
}: {
  serverId: string;
  userId: string;
  availability: AvailabilityInterval[];
}) {
  await db
    .update(serverMembers)
    .set({ availability })
    .where(and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, userId)));
}
