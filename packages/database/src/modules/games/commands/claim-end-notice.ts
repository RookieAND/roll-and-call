import { and, eq, isNotNull, isNull, lte, sql } from "drizzle-orm";

import { db } from "#/client";
import { games } from "#/schema";

import { sessionEndAtSql } from "../queries/session-end-at-sql";

// 종료 안내를 보낼 권리를 먼저 가져간다. 끝난 세션이고 아직 안 보냈을 때만 true라서, 마치기 직후 호출과 크론이 겹쳐도 한 번만 나간다.
export async function claimEndNotice({
  serverId,
  gameId,
  now,
}: {
  serverId: string;
  gameId: string;
  now: Date;
}): Promise<boolean> {
  const claimed = await db
    .update(games)
    .set({ endNotifiedAt: now })
    .where(
      and(
        eq(games.serverId, serverId),
        eq(games.id, gameId),
        isNotNull(games.confirmedAt),
        isNull(games.endNotifiedAt),
        isNull(games.cancelledAt),
        lte(sessionEndAtSql, sql`${now.toISOString()}::timestamptz`),
      ),
    )
    .returning({ id: games.id });
  return claimed.length > 0;
}
