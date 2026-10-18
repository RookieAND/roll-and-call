import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { games, rulebookCategories, rulebooks } from "#db/schema";

// 구인의 룰 분류를 제목에 붙일 이름. 약어가 있으면 약어, 없으면 이름이다. 룰북이 없으면 null.
export async function findGameCategoryLabel({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}) {
  const [row] = await db
    .select({ name: rulebookCategories.name, alias: rulebookCategories.alias })
    .from(games)
    .innerJoin(rulebooks, eq(rulebooks.id, games.rulebookId))
    .innerJoin(rulebookCategories, eq(rulebookCategories.id, rulebooks.categoryId))
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
  if (!row) return null;
  return row.alias?.trim() || row.name;
}
