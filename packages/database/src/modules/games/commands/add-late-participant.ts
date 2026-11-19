import { and, eq, sql } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "#db/modules/games/model/participant-status";
import type { Transaction } from "#db/modules/transaction";
import { games, participants } from "#db/schema";

// 다회차 1회차 시작 뒤 GM이 참여자를 더한다. 정원을 1 늘리고 중도 합류(late_joined)로 기록한다.
// 대기·내보낸 행이 있으면 확정으로 바꾸고, 없으면 새로 넣는다. 부르는 쪽이 게임 행을 잠그고 겹침을 확인한다.
export async function addLateParticipant({
  transaction,
  serverId,
  gameId,
  userId,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  userId: string;
}) {
  await transaction
    .update(games)
    .set({ maxPlayers: sql`${games.maxPlayers} + 1` })
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
  const values = {
    status: PARTICIPANT_STATUS.confirmed,
    lateJoined: true,
    leftReason: null,
    absent: false,
    absenceReason: null,
  };
  await transaction
    .insert(participants)
    .values({ serverId, gameId, userId, ...values })
    .onConflictDoUpdate({ target: [participants.gameId, participants.userId], set: values });
}
