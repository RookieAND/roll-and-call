import { db } from "#db/client";
import { availabilities } from "#db/schema";

// 자동 저장은 제출이 아니다(R15). availability_submitted_at을 건드리지 않는다.
export async function seedAvailabilities({
  serverId,
  gameId,
  userId,
  roundNo = 1,
  slotStarts,
}: {
  serverId: string;
  gameId: string;
  userId: string;
  roundNo?: number;
  slotStarts: Date[];
}) {
  if (slotStarts.length === 0) return;
  await db
    .insert(availabilities)
    .values(slotStarts.map((slotStart) => ({ serverId, gameId, userId, roundNo, slotStart })))
    .onConflictDoNothing();
}
