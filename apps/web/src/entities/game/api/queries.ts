import { and, eq, isNotNull, ne, or } from "drizzle-orm";
import { db, games, participants } from "@/shared/api/db";

export async function getGames() {
  return db.query.games.findMany({
    orderBy: (g, { desc }) => [desc(g.createdAt)],
    with: {
      kp: { columns: { username: true, avatarUrl: true } },
      // ponytail: loads all participant rows to count them; fine at this scale, swap to a COUNT subquery if games grow large
      participants: { columns: { userId: true } },
    },
  });
}

export async function getGameById(id: string) {
  return db.query.games.findFirst({
    where: (g, { eq: eqOp }) => eqOp(g.id, id),
    with: {
      kp: { columns: { username: true, avatarUrl: true } },
      participants: {
        columns: { userId: true },
        with: { user: { columns: { username: true, avatarUrl: true } } },
      },
    },
  });
}

export async function getGameAvailabilities(gameId: string) {
  return db.query.availabilities.findMany({
    where: (a, { eq: eqOp }) => eqOp(a.gameId, gameId),
    with: { user: { columns: { username: true } } },
  });
}

// Confirmed session start times of OTHER games the user is involved in (KP or
// participant). These block the user's grid — only confirmed sessions collide.
export async function getUserConfirmedSlots(
  userId: string,
  excludeGameId: string,
): Promise<string[]> {
  const rows = await db
    .selectDistinct({ confirmedAt: games.confirmedAt })
    .from(games)
    .leftJoin(
      participants,
      and(
        eq(participants.gameId, games.id),
        eq(participants.userId, userId),
      ),
    )
    .where(
      and(
        isNotNull(games.confirmedAt),
        ne(games.id, excludeGameId),
        or(eq(games.kpId, userId), eq(participants.userId, userId)),
      ),
    );

  return rows.map((r) => r.confirmedAt!.toISOString());
}
