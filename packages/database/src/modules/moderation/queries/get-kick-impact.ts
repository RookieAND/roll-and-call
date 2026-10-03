import { and, count, eq, sql } from "drizzle-orm";

import { db } from "../../../client";
import { games, participants } from "../../../schema";
import { notStartedGamesWhere } from "../../games/queries/not-started-games-where";

export interface KickImpact {
  appliedCount: number;
  waitingCount: number;
  confirmedCount: number;
  cancelledGameCount: number;
}

// 추방하면 빠지는 신청·대기·확정과 취소되는 구인 수. 추첨 전 추첨 구인의 확정 상태는 아직 신청이다.
export async function getKickImpact({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}): Promise<KickImpact> {
  const [joined] = await db
    .select({
      applied:
        sql<number>`count(*) filter (where ${participants.status} = 'confirmed' and ${games.recruitMethod} = 'lottery' and ${games.drawnAt} is null)`.mapWith(
          Number,
        ),
      waiting: sql<number>`count(*) filter (where ${participants.status} = 'waiting')`.mapWith(
        Number,
      ),
      confirmed:
        sql<number>`count(*) filter (where ${participants.status} = 'confirmed' and (${games.recruitMethod} <> 'lottery' or ${games.drawnAt} is not null))`.mapWith(
          Number,
        ),
    })
    .from(participants)
    .innerJoin(games, eq(games.id, participants.gameId))
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.userId, userId),
        notStartedGamesWhere(serverId),
      ),
    );
  const [hosted] = await db
    .select({ value: count() })
    .from(games)
    .where(and(notStartedGamesWhere(serverId), eq(games.gmId, userId)));
  return {
    appliedCount: joined?.applied ?? 0,
    waitingCount: joined?.waiting ?? 0,
    confirmedCount: joined?.confirmed ?? 0,
    cancelledGameCount: hosted?.value ?? 0,
  };
}
