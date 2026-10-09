import { and, eq, isNotNull } from "drizzle-orm";

import { db } from "#/client";
import { games, participants } from "#/schema";

// 신청글은 그 구인의 GM만 읽는다. 요청자가 GM이 아니면 빈 목록이다.
export async function getApplicationNotes({
  serverId,
  gameId,
  gmId,
}: {
  serverId: string;
  gameId: string;
  gmId: string;
}) {
  return db
    .select({ userId: participants.userId, note: participants.applicationNote })
    .from(participants)
    .innerJoin(
      games,
      and(eq(games.id, participants.gameId), eq(games.serverId, participants.serverId)),
    )
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.gameId, gameId),
        eq(games.gmId, gmId),
        isNotNull(participants.applicationNote),
      ),
    );
}
