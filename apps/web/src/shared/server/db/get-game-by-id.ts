import "server-only";
import { db } from "@roll-and-call/database";

export type GameDetailData = NonNullable<Awaited<ReturnType<typeof getGameById>>>;

export async function getGameById(id: string) {
  return db.query.games.findFirst({
    where: (game, { eq }) => eq(game.id, id),
    with: {
      gm: { columns: { username: true, avatarUrl: true, bio: true } },
      participants: {
        columns: { userId: true, joinedAt: true, status: true, drawRank: true, absent: true },
        with: { user: { columns: { username: true, avatarUrl: true, bio: true } } },
      },
    },
  });
}
