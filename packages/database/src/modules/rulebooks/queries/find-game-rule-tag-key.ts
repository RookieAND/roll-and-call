import { and, eq, sql } from "drizzle-orm";

import { db } from "#db/client";
import { HOMEBREW_FORUM_TAG_KEY } from "#db/modules/homebrew/model/homebrew-forum-tag-key";
import { games, homebrewRules, rulebooks } from "#db/schema";

// 모집 포럼 룰 태그를 고르는 열쇠. 룰 분류 id이고, 자작 룰이면 HOMEBREW_FORUM_TAG_KEY, 룰북에 맞지 않으면 null이다.
export async function findGameRuleTagKey({
  serverId,
  gameId,
}: {
  serverId: string;
  gameId: string;
}): Promise<string | null> {
  const [row] = await db
    .select({
      categoryId: rulebooks.categoryId,
      homebrew: sql<boolean>`exists (select 1 from ${homebrewRules} where ${homebrewRules.rulebookId} = ${rulebooks.id})`,
    })
    .from(games)
    .innerJoin(rulebooks, eq(rulebooks.id, games.rulebookId))
    .where(and(eq(games.serverId, serverId), eq(games.id, gameId)));
  if (!row) return null;
  return row.homebrew ? HOMEBREW_FORUM_TAG_KEY : row.categoryId;
}
