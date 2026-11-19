import { and, eq, sql } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "#db/modules/games/model/participant-status";
import type { Transaction } from "#db/modules/transaction";
import { games, participants } from "#db/schema";

// 참여자 추가 토스트의 [되돌리기]. 방금 중도 합류로 넣은 확정 행을 지우고 늘린 정원을 되돌린다.
export async function removeLateParticipant({
  transaction,
  serverId,
  gameId,
  userId,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
}): Promise<boolean> {
  const removed = await transaction
    .delete(participants)
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.userId, userId),
        eq(participants.status, PARTICIPANT_STATUS.confirmed),
        eq(participants.lateJoined, true),
      ),
    )
    .returning({ userId: participants.userId });
  if (removed.length === 0) return false;
  await transaction
    .update(games)
    .set({ maxPlayers: sql`${games.maxPlayers} - 1` })
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
  return true;
}
