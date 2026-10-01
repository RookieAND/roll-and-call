import { db } from "../../client";
import { getRespondedUserIds } from "../availability/get-responded-user-ids";
import { memberBioSql } from "../profiles/member-bio-sql";

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
        gm: { columns: { id: true, username: true, avatarUrl: true } },
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
              columns: { username: true, avatarUrl: true },
              extras: { bio: memberBioSql(serverId) },
            },
          },
        },
        drawResults: {
          where: (drawResult, { eq }) => eq(drawResult.serverId, serverId),
          with: {
            user: {
              columns: { username: true, avatarUrl: true },
              extras: { bio: memberBioSql(serverId) },
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
