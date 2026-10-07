import { and, eq, isNotNull } from "drizzle-orm";

import { db } from "#/client";
import { participants } from "#/schema";

// 내가 참여한 구인 중 본인이 저장한 구인(자동 저장 제외, R15).
export async function getRespondedGameIds({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}): Promise<Set<string>> {
  const rows = await db
    .select({ gameId: participants.gameId })
    .from(participants)
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.userId, userId),
        isNotNull(participants.availabilitySubmittedAt),
      ),
    );
  return new Set(rows.map((row) => row.gameId));
}
