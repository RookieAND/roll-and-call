import { and, eq, gt, isNull, or } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";
import { gameRounds, games } from "#db/schema";

// 다회차 구인을 조기 종결한다(GM의 [여기서 마치기]·회차 수를 시작한 회차 수로 줄이기는 manual, 조율형 30일은 stale).
// 아직 시작하지 않은 회차(일시 없음 포함)는 지운다. 예정 회차 수는 그대로 두고 finished_at은 트리거가 종결 시각으로 채운다.
// 끝까지 명단에 남은 사람이 완주다(isFinisher).
export async function finishGameEarly({
  transaction,
  serverId,
  gameId,
  reason,
  at,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  reason: "manual" | "stale";
  at: Date;
}) {
  await transaction
    .delete(gameRounds)
    .where(
      and(
        eq(gameRounds.serverId, serverId),
        eq(gameRounds.gameId, gameId),
        or(isNull(gameRounds.startAt), gt(gameRounds.startAt, at)),
      ),
    );
  await transaction
    .update(games)
    .set({ incompleteAt: at, incompleteReason: reason })
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId), isNull(games.incompleteAt)));
}
