import { and, eq, not, sql } from "drizzle-orm";

import { db } from "#db/client";
import { PARTICIPANT_STATUS } from "#db/modules/games/model/participant-status";
import { gameBucketSql } from "#db/modules/games/queries/game-bucket-sql";
import { publicGamesWhere } from "#db/modules/games/queries/public-games-where";
import { publicVisibilityWhere } from "#db/modules/games/queries/public-visibility-where";
import { games, participants } from "#db/schema";

// 확정 참가자로 들어간 끝나지 않은 공개 구인. 다회차도 구인 하나를 1로 센다.
export function upcomingCountsByPlayer({ serverId, now }: { serverId: string; now: Date }) {
  return db
    .select({
      userId: participants.userId,
      count: sql<number>`count(*)::int`.as("upcoming_count"),
    })
    .from(participants)
    .innerJoin(games, eq(games.id, participants.gameId))
    .where(
      and(
        eq(participants.serverId, serverId),
        eq(participants.status, PARTICIPANT_STATUS.confirmed),
        publicGamesWhere(serverId),
        publicVisibilityWhere,
        not(gameBucketSql({ now }).ended),
      ),
    )
    .groupBy(participants.userId);
}
