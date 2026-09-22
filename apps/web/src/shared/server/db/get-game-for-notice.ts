import "server-only";
import { db } from "@trpg/database";

export async function getGameForNotice(gameId: string) {
  return db.query.games.findFirst({
    where: (game, { eq }) => eq(game.id, gameId),
    with: {
      gm: { columns: { username: true } },
      participants: { columns: { status: true } },
    },
  });
}
