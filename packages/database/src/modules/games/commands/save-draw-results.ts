import { and, eq, isNotNull, or } from "drizzle-orm";

import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import type { Transaction } from "#/modules/transaction/transaction";
import { drawResults, participants } from "#/schema";

// 적용한 순간의 명단을 따로 남긴다. 뒤에 누가 나가도 추첨 결과는 그대로다.
export async function saveDrawResults({
  transaction,
  serverId,
  gameId,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
}) {
  const roster = await transaction
    .select({
      userId: participants.userId,
      roll: participants.drawRoll,
      status: participants.status,
    })
    .from(participants)
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        or(isNotNull(participants.drawRoll), eq(participants.status, PARTICIPANT_STATUS.confirmed)),
      ),
    );
  await transaction.insert(drawResults).values(roster.map((row) => ({ serverId, gameId, ...row })));
}
