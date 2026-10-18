import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { serverMembers, type AvailabilityInterval } from "#db/schema";

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
