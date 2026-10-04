import { and, eq, sql } from "drizzle-orm";

import {
  PARTICIPANT_STATUS,
  type ParticipantStatus,
} from "#/modules/games/model/participant-status";
import type { Transaction } from "#/modules/transaction/transaction";
import { participants } from "#/schema";

// 대기로 남는 사람은 추첨을 적용한 시각(트랜잭션 시각이라 모두 같다)에 줄을 서고, 그 안에서 drawRank 순서다.
export async function setDrawRank({
  transaction,
  serverId,
  gameId,
  userId,
  drawRank,
  status,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
  drawRank: number;
  status: ParticipantStatus;
}) {
  await transaction
    .update(participants)
    .set({
      drawRank,
      status,
      waitlistedAt: status === PARTICIPANT_STATUS.waiting ? sql`now()` : undefined,
    })
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.userId, userId),
      ),
    );
}
