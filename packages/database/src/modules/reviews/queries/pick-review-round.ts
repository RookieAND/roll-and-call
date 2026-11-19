import { and, asc, eq, isNotNull, lte } from "drizzle-orm";

import { db } from "#db/client";
import { gameRounds } from "#db/schema";

// 후기를 쓸 회차. 번호를 주면 그 회차, 아니면 이미 시작한 가장 뒤 회차(없으면 1회차)다.
export async function pickReviewRound({
  gameId,
  roundNo,
  now,
}: {
  gameId: string;
  roundNo: number | undefined;
  now: Date;
}) {
  if (roundNo) {
    const [round] = await db
      .select()
      .from(gameRounds)
      .where(and(eq(gameRounds.gameId, gameId), eq(gameRounds.roundNo, roundNo)));
    return round ?? null;
  }
  const started = await db
    .select()
    .from(gameRounds)
    .where(
      and(
        eq(gameRounds.gameId, gameId),
        isNotNull(gameRounds.startAt),
        lte(gameRounds.startAt, now),
      ),
    )
    .orderBy(asc(gameRounds.roundNo));
  if (started.length > 0) return started.at(-1)!;
  const [first] = await db
    .select()
    .from(gameRounds)
    .where(and(eq(gameRounds.gameId, gameId), eq(gameRounds.roundNo, 1)));
  return first ?? null;
}
