import { and, eq, gt, lt, sql } from "drizzle-orm";

import type { Transaction } from "#db/modules/transaction";
import { availabilities, gameRoundSkips, gameRounds, games } from "#db/schema";

// 회차를 생략한다. 회차 행을 지우면 그 회차의 출석·후기도 외래 키로 함께 지워지고, 원래 일시는 생략 기록으로 남긴다.
// 뒤 회차 번호는 하나씩 당긴다(번호 유일 제약은 트랜잭션 끝에서 검사한다). 지정형은 예정 회차 수가 1 줄고,
// 조율형은 예정 회차 수를 그대로 두고 맨 뒤에 일시 없는 회차를 하나 채운다.
// 막는 판단(roundSkipBlock)은 부르는 쪽이 잠근 게임 행으로 한다. 지운 회차 번호를 돌려준다.
export async function skipRound({
  transaction,
  serverId,
  gameId,
  roundNo,
  at,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  roundNo: number;
  at: Date;
}): Promise<boolean> {
  const [removed] = await transaction
    .delete(gameRounds)
    .where(
      and(
        eq(gameRounds.serverId, serverId),
        eq(gameRounds.gameId, gameId),
        eq(gameRounds.roundNo, roundNo),
      ),
    )
    .returning();
  if (!removed?.startAt || !removed.plannedEndAt) return false;
  await transaction.insert(gameRoundSkips).values({
    serverId,
    gameId,
    roundNo,
    originalStartAt: removed.startAt,
    originalPlannedEndAt: removed.plannedEndAt,
    skippedAt: at,
  });
  await transaction
    .update(gameRounds)
    .set({ roundNo: sql`${gameRounds.roundNo} - 1` })
    .where(and(eq(gameRounds.gameId, gameId), gt(gameRounds.roundNo, roundNo)));
  // 가능 시간도 회차 번호를 따른다. 기본 키가 즉시 검사라 음수로 한 번 옮긴 뒤 되돌린다.
  await transaction
    .delete(availabilities)
    .where(and(eq(availabilities.gameId, gameId), eq(availabilities.roundNo, roundNo)));
  await transaction
    .update(availabilities)
    .set({ roundNo: sql`-(${availabilities.roundNo} - 1)` })
    .where(and(eq(availabilities.gameId, gameId), gt(availabilities.roundNo, roundNo)));
  await transaction
    .update(availabilities)
    .set({ roundNo: sql`-${availabilities.roundNo}` })
    .where(and(eq(availabilities.gameId, gameId), lt(availabilities.roundNo, 0)));
  const [game] = await transaction
    .select({ roundCount: games.roundCount, kind: games.roundScheduleKind })
    .from(games)
    .where(eq(games.id, gameId));
  if (game!.kind === "designated") {
    await transaction
      .update(games)
      .set({ roundCount: sql`${games.roundCount} - 1` })
      .where(eq(games.id, gameId));
  } else {
    await transaction
      .insert(gameRounds)
      .values({ serverId, gameId, roundNo: game!.roundCount, status: "unscheduled" });
  }
  return true;
}
