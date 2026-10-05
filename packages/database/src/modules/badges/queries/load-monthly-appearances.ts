import { db } from "#/client";
import { type MonthlyAppearance } from "#/modules/badges/model/monthly-winners";
import { recordAppearances } from "#/modules/badges/model/record-appearances";

// ponytail: 끝난 세션을 한 번에 읽는다. 세션이 수만 건이 되면 달 단위 집계 쿼리로 바꾼다.
export async function loadMonthlyAppearances({
  serverId,
  now = new Date(),
}: {
  serverId: string;
  now?: Date;
}): Promise<MonthlyAppearance[]> {
  const rows = await db.query.games.findMany({
    columns: {
      id: true,
      gmId: true,
      confirmedAt: true,
      playMinutes: true,
      endedAt: true,
      hiddenAt: true,
      cancelledAt: true,
    },
    where: (game, { and, eq, isNotNull, isNull }) =>
      and(
        eq(game.serverId, serverId),
        isNotNull(game.confirmedAt),
        isNull(game.hiddenAt),
        isNull(game.cancelledAt),
      ),
    with: {
      rulebook: { columns: { miniRule: true } },
      participants: {
        columns: { userId: true, status: true, absent: true, absenceCancelledAt: true },
        where: (participant, { eq }) => eq(participant.serverId, serverId),
      },
    },
  });
  return recordAppearances(rows, now);
}
