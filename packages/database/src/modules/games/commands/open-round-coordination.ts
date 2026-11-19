import { and, eq } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";
import { availabilities, gameRounds, participants } from "#db/schema";

// 회차의 가능 시간 모으기를 연다. 다시 조율이면 start_at을 그대로 두고(정한 일정 유지) 예전 응답만 비운다.
export async function openRoundCoordination({
  transaction,
  serverId,
  gameId,
  roundNo,
  start,
  end,
  windowStartHour,
  windowEndHour,
  timezone,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  roundNo: number;
  start: string;
  end: string;
  windowStartHour: number;
  windowEndHour: number;
  timezone: string;
}): Promise<void> {
  await transaction
    .update(gameRounds)
    .set({
      status: "coordinating",
      coordinationStart: start,
      coordinationEnd: end,
      coordinationWindowStartHour: windowStartHour,
      coordinationWindowEndHour: windowEndHour,
      coordinationTimezone: timezone,
    })
    .where(
      and(
        eq(gameRounds.serverId, serverId),
        eq(gameRounds.gameId, gameId),
        eq(gameRounds.roundNo, roundNo),
      ),
    );
  await transaction
    .delete(availabilities)
    .where(
      and(
        eq(availabilities.serverId, serverId),
        eq(availabilities.gameId, gameId),
        eq(availabilities.roundNo, roundNo),
      ),
    );
  // 1회차의 제출 표시는 참여자 행에 있어 함께 지운다.
  if (roundNo === 1) {
    await transaction
      .update(participants)
      .set({ availabilitySubmittedAt: null })
      .where(and(eq(participants.serverId, serverId), eq(participants.gameId, gameId)));
  }
}
