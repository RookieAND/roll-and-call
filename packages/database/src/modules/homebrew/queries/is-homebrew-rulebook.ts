import { and, eq, sql } from "drizzle-orm";

import { db } from "#db/client";
import { homebrewRules } from "#db/schema";

export async function isHomebrewRulebook({
  serverId,
  rulebookId,
}: {
  serverId: string;
  rulebookId: string;
}): Promise<boolean> {
  const rows = await db
    .select({ one: sql<number>`1` })
    .from(homebrewRules)
    .where(and(eq(homebrewRules.serverId, serverId), eq(homebrewRules.rulebookId, rulebookId)))
    .limit(1);
  return rows.length > 0;
}
