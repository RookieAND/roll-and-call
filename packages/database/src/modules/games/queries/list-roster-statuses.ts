import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { participants } from "#/schema";

export async function listRosterStatuses({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  const roster = await db
    .select({ status: participants.status })
    .from(participants)
    .where(and(eq(participants.serverId, serverId), eq(participants.gameId, gameId)));
  return roster.map((participant) => participant.status);
}
