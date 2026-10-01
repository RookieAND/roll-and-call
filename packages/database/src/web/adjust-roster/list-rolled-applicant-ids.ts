import { and, asc, eq, isNotNull } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "../../rules";
import { participants } from "../../schema";
import type { Transaction } from "../transaction/transaction";

// 굴린 값이 낮은 순, 같으면 먼저 신청한 순.
export async function listRolledApplicantIds({
  transaction,
  serverId,
  gameId,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
}) {
  const rows = await transaction
    .select({ userId: participants.userId })
    .from(participants)
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.status, PARTICIPANT_STATUS.waiting),
        isNotNull(participants.drawRoll),
      ),
    )
    .orderBy(asc(participants.drawRoll), asc(participants.joinedAt));
  return rows.map((row) => row.userId);
}
