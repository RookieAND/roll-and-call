import "server-only";
import { db } from "@trpg/database";

import { getRespondedUserIds } from "./get-responded-user-ids";

export type GameParticipantsData = NonNullable<Awaited<ReturnType<typeof getGameParticipants>>>;

export async function getGameParticipants(gameId: string) {
  const game = await db.query.games.findFirst({
    where: (gameRow, { eq }) => eq(gameRow.id, gameId),
    with: {
      gm: { columns: { id: true, username: true, avatarUrl: true } },
      participants: {
        columns: { userId: true, joinedAt: true, status: true, drawRank: true, absent: true },
        with: { user: { columns: { username: true, avatarUrl: true } } },
      },
    },
  });
  if (!game) return null;

  return { game, availableUserIds: new Set(await getRespondedUserIds(gameId)) };
}
