import "server-only";
import { db } from "@roll-and-call/database";

import { getRespondedUserIds } from "./get-responded-user-ids";

export async function getGameParticipants(gameId: string) {
  const [game, respondedUserIds] = await Promise.all([
    db.query.games.findFirst({
      where: (gameRow, { eq }) => eq(gameRow.id, gameId),
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
          with: { user: { columns: { username: true, avatarUrl: true, bio: true } } },
        },
      },
    }),
    getRespondedUserIds(gameId),
  ]);
  if (!game) return null;

  return { game, availableUserIds: new Set(respondedUserIds) };
}
