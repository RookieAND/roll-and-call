import { and, eq, sql } from "drizzle-orm";

import type { Transaction } from "#/modules/transaction/transaction";
import { games } from "#/schema";

// 확정 시각은 마지막 확정으로 덮고, 처음 확정 시각은 한 번 적으면 그대로 둔다.
export async function markAttendanceConfirmed({
  transaction,
  serverId,
  gameId,
  at,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  at: Date;
}) {
  await transaction
    .update(games)
    .set({
      attendanceConfirmedAt: at,
      attendanceFirstConfirmedAt: sql`coalesce(${games.attendanceFirstConfirmedAt}, ${at.toISOString()}::timestamptz)`,
    })
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
}
