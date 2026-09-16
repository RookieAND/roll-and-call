import "server-only";
import { db } from "@trpg/database";

export async function getGameAvailabilities(gameId: string) {
  return db.query.availabilities.findMany({
    where: (availability, { eq }) => eq(availability.gameId, gameId),
    with: { user: { columns: { username: true } } },
  });
}
