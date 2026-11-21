import { and, eq, sql } from "drizzle-orm";

import { db } from "#db/client";
import { gameBucketSql } from "#db/modules/games/queries/game-bucket-sql";
import { publicGamesWhere } from "#db/modules/games/queries/public-games-where";
import { publicVisibilityWhere } from "#db/modules/games/queries/public-visibility-where";
import { games, profiles } from "#db/schema";

// ponytail: profiles를 join하는 건 칼럼 앞에 표 이름이 붙게 하려는 것이다. 표 하나만 읽으면 drizzle이 표 이름을 빼서 confirmedCountSql의 server_id가 안쪽 표로 풀린다.
export function recruitingCountsByGm({ serverId, now }: { serverId: string; now: Date }) {
  return db
    .select({ gmId: games.gmId, count: sql<number>`count(*)::int`.as("recruiting_count") })
    .from(games)
    .innerJoin(profiles, eq(profiles.id, games.gmId))
    .where(and(publicGamesWhere(serverId), gameBucketSql({ now }).live, publicVisibilityWhere))
    .groupBy(games.gmId);
}
