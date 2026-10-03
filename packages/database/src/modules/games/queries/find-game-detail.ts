import { db } from "#/client";
import { memberBioSql } from "#/modules/profiles/queries/member-bio-sql";

export async function findGameDetail({ serverId, gameId }: { serverId: string; gameId: string }) {
  return db.query.games.findFirst({
    where: (game, { and, eq }) => and(eq(game.serverId, serverId), eq(game.id, gameId)),
    with: {
      gm: { columns: { username: true, avatarUrl: true }, extras: { bio: memberBioSql(serverId) } },
      participants: {
        columns: { userId: true, joinedAt: true, status: true, drawRank: true, absent: true },
        where: (participant, { eq }) => eq(participant.serverId, serverId),
        with: {
          user: {
            columns: { username: true, avatarUrl: true },
            extras: { bio: memberBioSql(serverId) },
          },
        },
      },
    },
  });
}

export type GameDetailData = NonNullable<Awaited<ReturnType<typeof findGameDetail>>>;
