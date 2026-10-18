import { db } from "#db/client";
import { memberBioSql } from "#db/modules/profiles";
import { memberNicknameSql } from "#db/modules/profiles";

export async function findGameDetail({ serverId, gameId }: { serverId: string; gameId: string }) {
  return db.query.games.findFirst({
    where: (game, { and, eq }) => and(eq(game.serverId, serverId), eq(game.id, gameId)),
    with: {
      gm: {
        columns: { avatarUrl: true },
        extras: { username: memberNicknameSql(serverId), bio: memberBioSql(serverId) },
      },
      participants: {
        columns: {
          userId: true,
          joinedAt: true,
          status: true,
          drawRank: true,
          waitlistedAt: true,
          absent: true,
          absenceCancelledAt: true,
        },
        where: (participant, { eq }) => eq(participant.serverId, serverId),
        with: {
          user: {
            columns: { avatarUrl: true },
            extras: { username: memberNicknameSql(serverId), bio: memberBioSql(serverId) },
          },
        },
      },
    },
  });
}

export type GameDetailData = NonNullable<Awaited<ReturnType<typeof findGameDetail>>>;
