import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { participants } from "#/schema";

// 호출하는 쪽이 읽을 자격(그 구인의 GM이거나 운영진)을 이미 확인했다. 없으면 null이다.
export async function getApplicationNote({
  serverId,
  gameId,
  userId,
}: {
  serverId: string;
  gameId: string;
  userId: string;
}) {
  const [row] = await db
    .select({ note: participants.applicationNote })
    .from(participants)
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(participants.userId, userId),
      ),
    );
  return row?.note ?? null;
}
