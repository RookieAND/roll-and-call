import { and, eq, inArray, notInArray } from "drizzle-orm";

import { participants } from "../../schema";
import type { Transaction } from "../transaction/transaction";

// 확정 참여자 전원을 다시 쓴다. 기본값이 참석이라 목록에 없는 사람은 absent를 되돌린다.
export async function saveAttendance({
  transaction,
  serverId,
  gameId,
  confirmedUserIds,
  absentUserIds,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  confirmedUserIds: string[];
  absentUserIds: string[];
}) {
  const scope = and(
    eq(participants.serverId, serverId),
    eq(participants.gameId, gameId),
    inArray(participants.userId, confirmedUserIds),
  );
  await transaction
    .update(participants)
    .set({ absent: false })
    .where(
      absentUserIds.length === 0
        ? scope
        : and(scope, notInArray(participants.userId, absentUserIds)),
    );
  if (absentUserIds.length > 0) {
    await transaction
      .update(participants)
      .set({ absent: true })
      .where(
        and(
          eq(participants.serverId, serverId),
          eq(participants.gameId, gameId),
          inArray(participants.userId, absentUserIds),
        ),
      );
  }
}
