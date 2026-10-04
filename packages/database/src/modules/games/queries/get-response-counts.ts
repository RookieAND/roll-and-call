import { and, count, eq, inArray, isNotNull } from "drizzle-orm";

import { db } from "#/client";
import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import { participants } from "#/schema";

// 확정 참여자 중 본인이 저장한 사람(자동 저장 제외, R15) 수.
export async function getResponseCounts({
  serverId,
  gameIds,
}: {
  serverId: string;
  gameIds: string[];
}): Promise<Map<string, number>> {
  if (gameIds.length === 0) return new Map();
  const rows = await db
    .select({ gameId: participants.gameId, count: count() })
    .from(participants)
    .where(
      and(
        eq(participants.serverId, serverId),
        inArray(participants.gameId, gameIds),
        eq(participants.status, PARTICIPANT_STATUS.confirmed),
        isNotNull(participants.availabilitySubmittedAt),
      ),
    )
    .groupBy(participants.gameId);
  return new Map(rows.map((row) => [row.gameId, Number(row.count)]));
}
