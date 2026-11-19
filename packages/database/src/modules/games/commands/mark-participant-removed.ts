import { and, eq } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "#db/modules/games/model/participant-status";
import type { Transaction } from "#db/modules/transaction";
import { participants } from "#db/schema";

// 세션 시작 뒤 확정자를 불참으로 내보낸다. 행을 남겨 출석 명단과 불참 기록에 쓰고, 확정이 아니었으면 false.
// 다회차는 빠진 까닭(leftReason)을 남긴다. 합의 하차(mutual)는 불참 기록을 남기지 않는다.
export async function markParticipantRemoved({
  transaction,
  serverId,
  gameId,
  userId,
  absenceReason,
  leftReason,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
  absenceReason: string | null;
  leftReason?: "removed" | "mutual";
}) {
  const mutual = leftReason === "mutual";
  const marked = await transaction
    .update(participants)
    .set({
      status: PARTICIPANT_STATUS.removed,
      absent: !mutual,
      absenceReason: mutual ? null : absenceReason,
      leftReason: leftReason ?? null,
    })
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
