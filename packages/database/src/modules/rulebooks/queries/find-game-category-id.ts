import { and, eq } from "drizzle-orm";

import { db } from "#/client";
import { games, rulebooks } from "#/schema";

// 구인의 룰이 룰북에 맞지 않으면 null.
export async function findGameCategoryId({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  const [row] = await db
    .select({ categoryId: rulebooks.categoryId })
    .from(games)
    .innerJoin(rulebooks, eq(rulebooks.id, games.rulebookId))
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
  return row?.categoryId ?? null;
}
