import { and, count, eq, isNotNull } from "drizzle-orm";

import { db } from "#/client";
import { PARTICIPANT_STATUS } from "#/modules/games/model/participant-status";
import { games, participants } from "#/schema";

// GM 구인마다 확정 참여자 중 본인이 저장한 사람(자동 저장 제외, R15) 수.
export async function getResponseCountsByGm({
  serverId,
  gmId,
}: {
  serverId: string;
  gmId: string;
}): Promise<Map<string, number>> {
  const rows = await db
    .select({ gameId: participants.gameId, count: count() })
    .from(participants)
    .innerJoin(games, and(eq(games.serverId, serverId), eq(games.id, participants.gameId)))
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(games.gmId, gmId),
        eq(participants.status, PARTICIPANT_STATUS.confirmed),
        isNotNull(participants.availabilitySubmittedAt),
      ),
    )
    .groupBy(participants.gameId);
  return new Map(rows.map((row) => [row.gameId, Number(row.count)]));
}
