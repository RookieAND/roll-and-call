import "server-only";
import { db } from "@roll-and-call/database";

export async function getGameAvailabilities(gameId: string) {
  return db.query.availabilities.findMany({
    where: (availability, { eq }) => eq(availability.gameId, gameId),
    with: { user: { columns: { username: true } } },
  });
}
