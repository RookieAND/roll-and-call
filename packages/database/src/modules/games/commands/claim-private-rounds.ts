import { and, eq, gt, isNull, lte } from "drizzle-orm";

import { GAME_VISIBILITY } from "#db/modules/games/model/game-visibility";
import type { Transaction } from "#db/modules/transaction";
import { gameRounds, games } from "#db/schema";

export type DuePrivateRound = {
  gameId: string;
  serverId: string;
  gmId: string;
  title: string;
  roundNo: number;
};

// 비공개 다회차의 회차 알림 표시를 먼저 채워 가져간다(1시간 전은 notified_at, 시작은 start_notified_at). 구간은 (from, to]다.
export async function claimPrivateRounds({
  transaction,
  mark,
  window,
  now,
}: {
  transaction: Transaction;
  mark: "notifiedAt" | "startNotifiedAt";
  window: { from: Date; to: Date };
  now: Date;
}): Promise<DuePrivateRound[]> {
  const due = await transaction
    .select({
      id: gameRounds.id,
      gameId: games.id,
      serverId: games.serverId,
      gmId: games.gmId,
      title: games.title,
      roundNo: gameRounds.roundNo,
    })
    .from(gameRounds)
    .innerJoin(games, eq(games.id, gameRounds.gameId))
    .where(
      and(
        eq(games.visibility, GAME_VISIBILITY.private),
        gt(games.roundCount, 1),
        isNull(games.cancelledAt),
        isNull(games.hiddenAt),
        isNull(gameRounds[mark]),
        gt(gameRounds.startAt, window.from),
        lte(gameRounds.startAt, window.to),
      ),
    )
    .for("update", { of: gameRounds });
  for (const round of due) {
    await transaction
      .update(gameRounds)
      .set({ [mark]: now })
      .where(eq(gameRounds.id, round.id));
  }
  return due.map(({ id: _id, ...round }) => round);
}
