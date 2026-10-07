import { and, asc, isNotNull, isNull, lte, sql } from "drizzle-orm";

import { db } from "#/client";
import { games } from "#/schema";

import { sessionEndAtSql } from "./session-end-at-sql";

// 세션 종료 안내 크론이 집는 글: 끝났는데 아직 안내를 올리지 않은 구인(games_end_notice_due_idx).
export async function listDueEndNotices({ now, limit = 50 }: { now: Date; limit?: number }) {
  return db
    .select({ id: games.id, serverId: games.serverId })
    .from(games)
    .where(
      and(
        isNotNull(games.confirmedAt),
        isNotNull(games.discordThreadId),
        isNull(games.endNotifiedAt),
        isNull(games.cancelledAt),
        isNull(games.hiddenAt),
        lte(sessionEndAtSql, sql`${now.toISOString()}::timestamptz`),
      ),
    )
    .orderBy(asc(games.confirmedAt))
    .limit(limit);
}
