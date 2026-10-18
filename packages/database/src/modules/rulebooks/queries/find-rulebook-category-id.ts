import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { rulebookCategories } from "#db/schema";

export async function findRulebookCategoryId({
  serverId,
  name,
}: {
  serverId: string;
  name: string;
}) {
  const [category] = await db
    .select({ id: rulebookCategories.id })
    .from(rulebookCategories)
    .where(and(eq(rulebookCategories.serverId, serverId), eq(rulebookCategories.name, name)));
  return category?.id ?? null;
}
