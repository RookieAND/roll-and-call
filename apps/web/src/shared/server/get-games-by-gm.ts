import "server-only";
import { db, games } from "@trpg/database";
import { desc } from "drizzle-orm";

export async function getGamesByGm(userId: string) {
  return db.query.games.findMany({
    where: (game, { eq }) => eq(game.gmId, userId),
    orderBy: desc(games.createdAt),
    with: {
      gm: { columns: { username: true, avatarUrl: true } },
      participants: { columns: { userId: true, status: true, joinedAt: true } },
    },
  });
}
