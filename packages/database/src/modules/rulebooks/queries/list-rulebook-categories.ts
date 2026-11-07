import { and, asc, eq, sql } from "drizzle-orm";

import { db } from "#db/client";
import { homebrewRules, rulebookCategories, rulebooks } from "#db/schema";

// 포럼 태그 설정의 룰 분류 줄. 자작 룰 분류는 빼고 고정 줄 「자작 룰」 하나로 묶는다.
export async function listRulebookCategories({ serverId }: { serverId: string }) {
  return db
    .select({ id: rulebookCategories.id, name: rulebookCategories.name })
    .from(rulebookCategories)
    .where(
      and(
        eq(rulebookCategories.serverId, serverId),
        sql`not exists (select 1 from ${rulebooks} join ${homebrewRules} on ${homebrewRules.rulebookId} = ${rulebooks.id} where ${rulebooks.categoryId} = ${rulebookCategories.id})`,
      ),
    )
    .orderBy(asc(rulebookCategories.name));
}
