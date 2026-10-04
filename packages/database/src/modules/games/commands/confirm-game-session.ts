import { and, eq, isNull, sql } from "drizzle-orm";

import { db } from "#/client";
import type { Transaction } from "#/modules/transaction/transaction";
import { games } from "#/schema";

// GM 본인 글이 아니거나 취소된 구인이면 바꾸지 않고 false.
// 1시간 전 리마인더 기록(notified_at)은 시각이 실제로 바뀔 때만 지운다(U14-07). 같은 시각 재확정은 그대로 둔다.
export async function confirmGameSession({
  transaction,
  serverId,
  gameId,
  gmId,
  confirmedAt,
}: {
  transaction?: Transaction;
  serverId: string;
  gameId: string;
  gmId: string;
  confirmedAt: Date;
}) {
  const updated = await (transaction ?? db)
    .update(games)
    .set({
      confirmedAt,
      notifiedAt: sql`case when ${games.confirmedAt} is distinct from ${confirmedAt.toISOString()}::timestamptz then null else ${games.notifiedAt} end`,
    })
    .where(
      and(
        eq(games.serverId, serverId),
        eq(games.id, gameId),
        eq(games.gmId, gmId),
        isNull(games.cancelledAt),
      ),
    )
    .returning({ id: games.id });
  return updated.length > 0;
}
