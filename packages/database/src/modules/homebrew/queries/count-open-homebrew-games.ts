import { and, count, eq, isNull, not } from "drizzle-orm";

import { db } from "#db/client";
import { gameBucketSql } from "#db/modules/games/queries/game-bucket-sql";
import { games } from "#db/schema";

// 자작 룰 숨김 확인 창의 「열린 구인 n건」. 취소하지 않았고 세션이 끝나지 않은 구인이다(모집 마감·일정 조율 중 포함).
export async function countOpenHomebrewGames({
  serverId,
  rulebookId,
}: {
  serverId: string;
  rulebookId: string;
}) {
  const { ended } = gameBucketSql({ now: new Date() });
  const [row] = await db
    .select({ value: count() })
    .from(games)
    .where(
      and(
        eq(games.serverId, serverId),
        eq(games.rulebookId, rulebookId),
        isNull(games.cancelledAt),
        not(ended),
      ),
    );
  return row?.value ?? 0;
}
