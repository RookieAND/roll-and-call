import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import type { Transaction } from "#db/modules/transaction";
import { participants } from "#db/schema";

export async function listRosterStatuses({
  transaction,
  serverId,
  gameId,
}: {
  transaction?: Transaction;
  serverId: string;
  gameId: string;
}) {
  const roster = await (transaction ?? db)
    .select({ status: participants.status })
    .from(participants)
    .where(and(eq(participants.serverId, serverId), eq(participants.gameId, gameId)));
  return roster.map((participant) => participant.status);
}
