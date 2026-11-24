import { and, eq, not, or, sql } from "drizzle-orm";

import { db } from "#db/client";
import { PARTICIPANT_STATUS } from "#db/modules/games/model/participant-status";
import { firstRoundStartSql } from "#db/modules/games/queries/first-round-sql";
import { gameBucketSql } from "#db/modules/games/queries/game-bucket-sql";
import { publicGamesWhere } from "#db/modules/games/queries/public-games-where";
import { games, participants } from "#db/schema";

// 확정 참가자로 들어간 아직 시작하지 않은 구인(비공개 포함, 세션 목록과 같다). 다회차도 구인 하나를 1로 센다.
export function upcomingCountsByPlayer({ serverId, now }: { serverId: string; now: Date }) {
  const at = sql`${now.toISOString()}::timestamptz`;
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
        not(gameBucketSql({ now }).ended),
        or(sql`${firstRoundStartSql} is null`, sql`${firstRoundStartSql} > ${at}`),
      ),
    )
    .groupBy(participants.userId);
}
