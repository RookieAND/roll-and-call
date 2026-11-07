import { and, eq, ne, sql } from "drizzle-orm";

import type { Executor } from "#db/modules/transaction";
import { homebrewRuleApplications, rulebookCategories, rulebooks } from "#db/schema";

import { homebrewNameKey } from "../model/homebrew-name-key";
import { homebrewNameKeySql } from "../model/homebrew-name-key-sql";

// 같은 서버에 같은 이름의 룰북·룰 분류·심사 중 자작 룰 신청이 있으면 겹친다. 판본은 보지 않는다(분류 이름이 서버에서 하나뿐이라).
export async function hasHomebrewNameConflict({
  executor,
  serverId,
  name,
  excludeApplicationId,
}: {
  executor: Executor;
  serverId: string;
  name: string;
  excludeApplicationId?: string;
}): Promise<boolean> {
  const key = homebrewNameKey(name);
  const rows = await executor
    .select({ one: sql<number>`1` })
    .from(rulebooks)
    .where(and(eq(rulebooks.serverId, serverId), eq(homebrewNameKeySql(rulebooks.name), key)))
    .unionAll(
      executor
        .select({ one: sql<number>`1` })
        .from(rulebookCategories)
        .where(
          and(
            eq(rulebookCategories.serverId, serverId),
            eq(homebrewNameKeySql(rulebookCategories.name), key),
          ),
        ),
    )
    .unionAll(
      executor
        .select({ one: sql<number>`1` })
        .from(homebrewRuleApplications)
        .where(
          and(
            eq(homebrewRuleApplications.serverId, serverId),
            eq(homebrewRuleApplications.status, "pending"),
            eq(homebrewNameKeySql(homebrewRuleApplications.name), key),
            excludeApplicationId
              ? ne(homebrewRuleApplications.id, excludeApplicationId)
              : undefined,
          ),
        ),
    )
    .limit(1);
  return rows.length > 0;
}
