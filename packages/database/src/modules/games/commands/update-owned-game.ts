import { and, eq, isNull } from "drizzle-orm";

import { db } from "../../../client";
import { games, type NewGame } from "../../../schema";

// 바뀐 행이 없으면(남의 글이거나 지워졌거나 취소됐으면) false.
export async function updateOwnedGame({
  serverId,
  gameId,
  gmId,
  columns,
}: {
  serverId: string;
  gameId: string;
  gmId: string;
  columns: Partial<Omit<NewGame, "id" | "serverId" | "gmId">>;
}) {
  const updated = await db
    .update(games)
    .set(columns)
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
