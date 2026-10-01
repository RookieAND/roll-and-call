import { and, eq, isNotNull } from "drizzle-orm";

import { participants } from "../../../schema";
import type { Transaction } from "../../transaction/transaction";

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
