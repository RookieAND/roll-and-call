import { and, eq, isNotNull } from "drizzle-orm";

import { db } from "#/client";
import { participants } from "#/schema";

// 이 구인 참여자 중 본인이 저장한 사람(자동 저장 제외, R15).
export async function getRespondedUserIds({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}): Promise<string[]> {
  const rows = await db
    .select({ userId: participants.userId })
    .from(participants)
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        isNotNull(participants.availabilitySubmittedAt),
      ),
    );
  return rows.map((row) => row.userId);
}
