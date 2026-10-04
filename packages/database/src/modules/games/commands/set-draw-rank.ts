import { and, eq } from "drizzle-orm";

import {
  PARTICIPANT_STATUS,
  type ParticipantStatus,
} from "#/modules/games/model/participant-status";
import type { Transaction } from "#/modules/transaction/transaction";
import { participants } from "#/schema";

// 대기로 남는 사람은 추첨 시각(at, 모두 같다)에 줄을 서고, 그 안에서 drawRank 순서다.
export async function setDrawRank({
  transaction,
  serverId,
  gameId,
  userId,
  drawRoll,
  drawRank,
  status,
  at,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
  drawRoll: number;
  drawRank: number;
  status: ParticipantStatus;
  at: Date;
}) {
  await transaction
    .update(participants)
    .set({
      drawRoll,
      drawRank,
      status,
      waitlistedAt: status === PARTICIPANT_STATUS.waiting ? at : undefined,
    })
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.userId, userId),
      ),
    );
}
