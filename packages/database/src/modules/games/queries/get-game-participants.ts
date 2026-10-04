import { db } from "#/client";
import { memberBioSql } from "#/modules/profiles/queries/member-bio-sql";
import { memberNicknameSql } from "#/modules/profiles/queries/member-nickname-sql";

import { getRespondedUserIds } from "./get-responded-user-ids";

export async function getGameParticipants({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  const [game, respondedUserIds] = await Promise.all([
    db.query.games.findFirst({
      where: (gameRow, { and, eq }) => and(eq(gameRow.serverId, serverId), eq(gameRow.id, gameId)),
      with: {
        gm: {
          columns: { id: true, avatarUrl: true },
          extras: { username: memberNicknameSql(serverId) },
        },
        participants: {
          columns: {
            userId: true,
            joinedAt: true,
            status: true,
            drawRank: true,
            drawRoll: true,
            absent: true,
          },
          where: (participant, { eq }) => eq(participant.serverId, serverId),
          with: {
            user: {
              columns: { avatarUrl: true },
              extras: { username: memberNicknameSql(serverId), bio: memberBioSql(serverId) },
            },
          },
        },
        drawResults: {
          where: (drawResult, { eq }) => eq(drawResult.serverId, serverId),
          with: {
            user: {
              columns: { avatarUrl: true },
              extras: { username: memberNicknameSql(serverId), bio: memberBioSql(serverId) },
            },
          },
        },
      },
    }),
    getRespondedUserIds({ serverId, gameId }),
  ]);
  if (!game) return null;

  return { game, availableUserIds: new Set(respondedUserIds) };
}
