import { and, eq, inArray } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";
import { gameRounds } from "#db/schema";

type RoundMove = { roundNo: number; startAt: Date; plannedEndAt: Date };

// 여러 회차의 일시를 한꺼번에 옮기고 옮기기 전 값을 돌려준다(되돌리기용).
// 겹침 제약이 즉시 검사라 뒤로 미루면 맨 뒤 회차부터, 앞당기면 맨 앞 회차부터 고친다.
export async function moveRounds({
  transaction,
  serverId,
  gameId,
  moves,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  moves: readonly RoundMove[];
}): Promise<RoundMove[]> {
  const scope = and(eq(gameRounds.serverId, serverId), eq(gameRounds.gameId, gameId));
  const rows = await transaction
    .select()
    .from(gameRounds)
    .where(
      and(
        scope,
        inArray(
          gameRounds.roundNo,
          moves.map((move) => move.roundNo),
        ),
      ),
    );
  const previous = new Map(rows.map((row) => [row.roundNo, row]));
  const ordered = moves.toSorted((a, b) => a.roundNo - b.roundNo);
  const first = ordered[0];
  const firstBefore = first && previous.get(first.roundNo)?.startAt;
  if (first && firstBefore && first.startAt.getTime() > firstBefore.getTime()) ordered.reverse();
  for (const move of ordered) {
    await transaction
      .update(gameRounds)
      .set({ startAt: move.startAt, plannedEndAt: move.plannedEndAt })
      .where(and(scope, eq(gameRounds.roundNo, move.roundNo)));
  }
  return moves.flatMap((move) => {
    const row = previous.get(move.roundNo);
    return row?.startAt && row.plannedEndAt
      ? [{ roundNo: move.roundNo, startAt: row.startAt, plannedEndAt: row.plannedEndAt }]
      : [];
  });
}
