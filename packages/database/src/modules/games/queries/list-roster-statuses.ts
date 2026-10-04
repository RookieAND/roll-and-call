import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import type { Transaction } from "#/modules/transaction/transaction";
import { participants } from "#/schema";

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
