import { and, eq, inArray } from "drizzle-orm";

import { replaceManualSupplement } from "#db/modules/games/model";
import type { Executor } from "#db/modules/transaction";
import { games, rulebookRequestGames } from "#db/schema";

// 추가 요청을 룰북으로 등록·연결하면, 그 이름을 직접 입력한 구인의 서플리먼트를 등록된 룰북으로 바꾼다.
// 디스코드 모집 글은 다음 수정 때 새 이름으로 바뀐다.
export async function resolveRequestSupplements({
  executor,
  serverId,
  requestId,
  requestName,
  rulebook,
}: {
  executor: Executor;
  serverId: string;
  requestId: string;
  requestName: string;
  rulebook: { id: string; name: string };
}) {
  const thisRequest = and(
    eq(rulebookRequestGames.serverId, serverId),
    eq(rulebookRequestGames.requestId, requestId),
  );
  const links = await executor
    .select({ gameId: rulebookRequestGames.gameId })
    .from(rulebookRequestGames)
    .where(thisRequest);
  if (links.length === 0) return;
  const rows = await executor
    .select({ id: games.id, supplements: games.supplements })
    .from(games)
    .where(
      and(
        eq(games.serverId, serverId),
        inArray(
          games.id,
          links.map((link) => link.gameId),
        ),
      ),
    );
  for (const row of rows) {
    const next = replaceManualSupplement({
      supplements: row.supplements,
      name: requestName,
      rulebook,
    });
    if (next) await executor.update(games).set({ supplements: next }).where(eq(games.id, row.id));
  }
  await executor.delete(rulebookRequestGames).where(thisRequest);
}
