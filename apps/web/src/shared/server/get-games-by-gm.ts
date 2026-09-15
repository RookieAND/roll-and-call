import "server-only";
import { desc } from "drizzle-orm";

import { db } from "./db";
import { games } from "./schema";

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
