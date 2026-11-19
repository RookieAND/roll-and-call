import { and, gt, isNotNull, isNull, lte } from "drizzle-orm";

import { db } from "#db/client";
import { games } from "#db/schema";

// 끝났는데 구인 스레드를 아직 잠그지 않은 다회차. 단발 스레드는 잠그지 않는다.
export async function listThreadsToLock({ now = new Date(), limit = 50 } = {}) {
  return db
    .select({ serverId: games.serverId, gameId: games.id, threadId: games.discordThreadId })
    .from(games)
    .where(
      and(
        gt(games.roundCount, 1),
        isNotNull(games.finishedAt),
        lte(games.finishedAt, now),
        isNotNull(games.discordThreadId),
        isNull(games.threadLockedAt),
      ),
    )
    .limit(limit);
}
