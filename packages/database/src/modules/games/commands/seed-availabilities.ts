import { db } from "../../../client";
import { availabilities } from "../../../schema";

export async function seedAvailabilities({
  serverId,
  gameId,
  userId,
  slotStarts,
}: {
  serverId: string;
  gameId: string;
  userId: string;
  slotStarts: Date[];
}) {
  if (slotStarts.length === 0) return;
  await db
    .insert(availabilities)
    .values(slotStarts.map((slotStart) => ({ serverId, gameId, userId, slotStart })))
    .onConflictDoNothing();
}
