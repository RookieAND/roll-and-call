import { desc } from "drizzle-orm";

import { db } from "#/client";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";
import { games } from "#/schema";

export async function getGamesByGm({ serverId, userId }: { serverId: string; userId: string }) {
  return db.query.games.findMany({
    where: (game, { and, eq }) => and(eq(game.serverId, serverId), eq(game.gmId, userId)),
    orderBy: desc(games.createdAt),
    with: {
      gm: { columns: { avatarUrl: true }, extras: { username: memberNicknameSql(serverId) } },
      participants: {
        columns: {
          userId: true,
          status: true,
          joinedAt: true,
          drawRank: true,
          waitlistedAt: true,
          absent: true,
        },
        where: (participant, { eq }) => eq(participant.serverId, serverId),
      },
    },
  });
}
