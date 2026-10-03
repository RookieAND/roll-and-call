import { and, eq } from "drizzle-orm";

import type { Transaction } from "#/modules/transaction/transaction";
import { games } from "#/schema";

export async function setAttendanceConfirmedAt({
  transaction,
  serverId,
  gameId,
  attendanceConfirmedAt,
}: {
  transaction: Transaction;
  serverId: string;
  gameId: string;
  attendanceConfirmedAt: Date | null;
}) {
  await transaction
    .update(games)
    .set({ attendanceConfirmedAt })
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
}
