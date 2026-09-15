import "server-only";
import { db } from "./db";

export async function getGameAvailabilities(gameId: string) {
  return db.query.availabilities.findMany({
    where: (availability, { eq }) => eq(availability.gameId, gameId),
    with: { user: { columns: { username: true } } },
  });
}
