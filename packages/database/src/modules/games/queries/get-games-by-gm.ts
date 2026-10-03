import { desc } from "drizzle-orm";

import { db } from "#/client";
import { games } from "#/schema";

export async function getGamesByGm({ serverId, userId }: { serverId: string; userId: string }) {
  return db.query.games.findMany({
    where: (game, { and, eq }) => and(eq(game.serverId, serverId), eq(game.gmId, userId)),
    orderBy: desc(games.createdAt),
    with: {
      gm: { columns: { username: true, avatarUrl: true } },
      participants: {
        columns: { userId: true, status: true, joinedAt: true, absent: true },
        where: (participant, { eq }) => eq(participant.serverId, serverId),
      },
    },
  });
}
