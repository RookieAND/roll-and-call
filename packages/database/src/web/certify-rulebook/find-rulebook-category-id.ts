import { eq } from "drizzle-orm";

import { db } from "../../client";
import { rulebookCategories } from "../../schema";

export async function findRulebookCategoryId(name: string) {
  const [category] = await db
    .select({ id: rulebookCategories.id })
    .from(rulebookCategories)
    .where(eq(rulebookCategories.name, name));
  return category?.id ?? null;
}
