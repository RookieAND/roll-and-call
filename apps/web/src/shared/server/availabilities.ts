import "server-only";

import { and, eq, isNotNull, ne, or } from "drizzle-orm";
import { db, games, participants } from "./db";

export async function getGameAvailabilities(gameId: string) {
  return db.query.availabilities.findMany({
    where: (a, { eq: eqOp }) => eqOp(a.gameId, gameId),
    with: { user: { columns: { username: true } } },
  });
}

// Confirmed session start times of OTHER games the user is involved in (GM or
// participant). These block the user's grid — only confirmed sessions collide.
export async function getUserConfirmedSlots(
  userId: string,
  excludeGameId: string,
): Promise<string[]> {
  const rows = await db
    .selectDistinct({ confirmedAt: games.confirmedAt })
    .from(games)
    .leftJoin(participants, and(eq(participants.gameId, games.id), eq(participants.userId, userId)))
    .where(
      and(
        isNotNull(games.confirmedAt),
        ne(games.id, excludeGameId),
        or(eq(games.gmId, userId), eq(participants.userId, userId)),
      ),
    );

  return rows.map((r) => r.confirmedAt!.toISOString());
}
