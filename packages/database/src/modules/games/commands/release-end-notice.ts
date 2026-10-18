import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { games } from "#db/schema";

// 가져간 종료 안내 권리를 돌려준다. 보내지 못한 안내를 다음 크론(notify-session-ended)이 다시 집는다.
// 그 사이 다른 호출이 다시 가져갔으면 건드리지 않도록 가져간 시각이 같을 때만 지운다.
export async function releaseEndNotice({
  serverId,
  gameId,
  claimedAt,
}: {
  serverId: string;
  gameId: string;
  claimedAt: Date;
}) {
  await db
    .update(games)
    .set({ endNotifiedAt: null })
    .where(
      and(eq(games.serverId, serverId), eq(games.id, gameId), eq(games.endNotifiedAt, claimedAt)),
    );
}
