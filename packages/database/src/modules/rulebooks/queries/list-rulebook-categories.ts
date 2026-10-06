import { asc, eq } from "drizzle-orm";

import { db } from "#/client";
import { rulebookCategories } from "#/schema";

export async function listRulebookCategories({ serverId }: { serverId: string }) {
  return db
    .select({ id: rulebookCategories.id, name: rulebookCategories.name })
    .from(rulebookCategories)
    .where(eq(rulebookCategories.serverId, serverId))
    .orderBy(asc(rulebookCategories.name));
}
