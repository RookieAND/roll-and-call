import {
  PARTICIPANT_STATUS,
  type ParticipantStatus,
} from "#db/modules/games/model/participant-status";
import type { Transaction } from "#db/modules/transaction";
import { participants } from "#db/schema";

// 이미 행이 있으면 넣지 않고 false를 돌려준다. 대기로 넣을 때만 waitlistedAt을 남긴다.
export async function insertParticipant({
  transaction,
  serverId,
  gameId,
  userId,
  status,
  waitlistedAt,
  applicationNote,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
  status: ParticipantStatus;
  waitlistedAt?: Date;
  applicationNote?: string | null;
}) {
  const inserted = await transaction
    .insert(participants)
    .values({
      serverId,
      gameId,
      userId,
      status,
      applicationNote,
      waitlistedAt: status === PARTICIPANT_STATUS.waiting ? waitlistedAt : undefined,
    })
    .onConflictDoNothing()
    .returning({ userId: participants.userId });
  return inserted.length > 0;
}
