import { db } from "#/client";
import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import { memberBioSql } from "#/modules/profiles/queries/member-bio-sql";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";

export async function findPreviousRound({
  serverId,
  gameId,
  gmId,
}: {
  serverId: string;
  gameId: string;
  gmId: string;
}) {
  return db.query.games.findFirst({
    where: (table, { and, eq }) =>
      and(eq(table.serverId, serverId), eq(table.id, gameId), eq(table.gmId, gmId)),
    with: {
      participants: {
        where: (table, { and, eq }) =>
          and(eq(table.serverId, serverId), eq(table.status, PARTICIPANT_STATUS.waiting)),
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
