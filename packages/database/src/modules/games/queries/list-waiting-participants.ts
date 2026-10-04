import { and, eq, isNotNull } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import type { Transaction } from "#/modules/transaction/transaction";
import { participants, serverMembers } from "#/schema";

// 대기 순서를 정할 칼럼과 서버를 나갔는지(departed)를 함께 돌려준다. 정렬은 compareWaitlistOrder로 한다.
export async function listWaitingParticipants({
  transaction,
  serverId,
  gameId,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
}) {
  return transaction
    .select({
      userId: participants.userId,
      joinedAt: participants.joinedAt,
      drawRank: participants.drawRank,
      waitlistedAt: participants.waitlistedAt,
      departed: isNotNull(serverMembers.deletedAt).mapWith(Boolean),
    })
    .from(participants)
    .leftJoin(
      serverMembers,
      and(eq(serverMembers.serverId, serverId), eq(serverMembers.userId, participants.userId)),
    )
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.status, PARTICIPANT_STATUS.waiting),
      ),
    );
}
