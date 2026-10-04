import { and, eq } from "drizzle-orm";

import {
  PARTICIPANT_STATUS,
  type ParticipantStatus,
} from "#/modules/games/model/participant-status";
import type { Transaction } from "#/modules/transaction/transaction";
import { participants } from "#/schema";

// 확정으로 바꾸면 불참 표시를 지운다(불참으로 내보낸 사람을 다시 넣는 경우).
const attending = { absent: false, absenceReason: null };

export async function setParticipantStatus({
  transaction,
  serverId,
  gameId,
  userId,
  status,
  waitlistedAt,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
  status: ParticipantStatus;
  // 넘기지 않으면 원래 값을 둔다. 확정으로 올려도 지우지 않아야 되돌릴 때 원래 대기 자리로 간다.
  waitlistedAt?: Date;
}) {
  await transaction
    .update(participants)
    .set({ status, waitlistedAt, ...(status === PARTICIPANT_STATUS.confirmed && attending) })
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.userId, userId),
      ),
    );
}
