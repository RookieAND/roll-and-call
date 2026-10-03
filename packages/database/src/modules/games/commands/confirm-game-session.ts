import { and, eq, isNull } from "drizzle-orm";

import { db } from "#/client";
import { games } from "#/schema";

// GM 본인 글이 아니거나 취소된 구인이면 바꾸지 않고 false.
export async function confirmGameSession({
  serverId,
  gameId,
  gmId,
  confirmedAt,
}: {
  serverId: string;
  gameId: string;
  gmId: string;
  confirmedAt: Date;
}) {
  const updated = await db
    .update(games)
    // reset notifiedAt so re-confirming a new time re-arms the 1h reminder
    .set({ confirmedAt, notifiedAt: null })
    .where(
      and(
        eq(games.serverId, serverId),
        eq(games.id, gameId),
        eq(games.gmId, gmId),
        isNull(games.cancelledAt),
      ),
    )
    .returning({ id: games.id });
  return updated.length > 0;
}
