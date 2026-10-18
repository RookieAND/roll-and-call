import { and, eq, isNotNull } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";
import { participants } from "#db/schema";

export async function countRolledParticipants({
  transaction,
  serverId,
  gameId,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
}) {
  return transaction.$count(
    participants,
    and(
      eq(participants.serverId, serverId),
      eq(participants.gameId, gameId),
      isNotNull(participants.drawRoll),
    ),
  );
}
