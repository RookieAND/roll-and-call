import { and, eq } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import type { Transaction } from "#/modules/transaction/transaction";
import { participants } from "#/schema";

// 세션 시작 뒤 확정자를 불참으로 내보낸다. 행을 남겨 출석 명단과 불참 기록에 쓰고, 확정이 아니었으면 false.
export async function markParticipantRemoved({
  transaction,
  serverId,
  gameId,
  userId,
  absenceReason,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
  absenceReason: string | null;
}) {
  const marked = await transaction
    .update(participants)
    .set({ status: PARTICIPANT_STATUS.removed, absent: true, absenceReason })
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.userId, userId),
        eq(participants.status, PARTICIPANT_STATUS.confirmed),
      ),
    )
    .returning({ userId: participants.userId });
  return marked.length > 0;
}
