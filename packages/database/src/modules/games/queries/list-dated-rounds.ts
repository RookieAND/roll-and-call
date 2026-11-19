import { and, asc, eq, isNotNull } from "drizzle-orm";

import { db } from "#db/client";
import type { TargetRound } from "#db/modules/games/model/overlapping-round-numbers";
import type { Transaction } from "#db/modules/transaction";
import { gameRounds } from "#db/schema";

// 일시가 정해진 회차만 번호 순서로 돌려준다. 겹침 검사의 목표 회차다.
export async function listDatedRounds({
  transaction,
  gameId,
}: {
  transaction?: Transaction;
  gameId: string;
}): Promise<TargetRound[]> {
  const rows = await (transaction ?? db)
    .select({
      roundNo: gameRounds.roundNo,
      startsAt: gameRounds.startAt,
      endsAt: gameRounds.plannedEndAt,
    })
    .from(gameRounds)
    .where(and(eq(gameRounds.gameId, gameId), isNotNull(gameRounds.startAt)))
    .orderBy(asc(gameRounds.roundNo));
  return rows.map((row) => ({ ...row, startsAt: row.startsAt!, endsAt: row.endsAt! }));
}
