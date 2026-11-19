import { and, count, eq, isNull } from "drizzle-orm";

import { db } from "#db/client";
import { gameRounds, roundAttendances, sessionReviews } from "#db/schema";

// 다회차 한 회차의 출석 화면이 읽는다. 회차 행, 저장된 출석(확정 전이면 비어 있다), 생략 확인 창에 쓸 후기 수.
export async function getRoundAttendance({
  serverId,
  gameId,
  roundNo,
}: {
  serverId: string;
  gameId: string;
  roundNo: number;
}) {
  const [round] = await db
    .select()
    .from(gameRounds)
    .where(
      and(
        eq(gameRounds.serverId, serverId),
        eq(gameRounds.gameId, gameId),
        eq(gameRounds.roundNo, roundNo),
      ),
    );
  if (!round) return null;
  const [attendance, [reviews]] = await Promise.all([
    db
      .select({ userId: roundAttendances.userId, attended: roundAttendances.attended })
      .from(roundAttendances)
      .where(eq(roundAttendances.roundId, round.id)),
    db
      .select({ total: count() })
      .from(sessionReviews)
      .where(and(eq(sessionReviews.roundId, round.id), isNull(sessionReviews.removedAt))),
  ]);
  return { round, attendance, reviewCount: reviews?.total ?? 0 };
}
