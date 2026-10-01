import { sql } from "drizzle-orm";

import { rulebookCategories } from "../schema";
import type { Executor } from "./record-audit";

export async function removeEmptyCategories(executor: Executor) {
  await executor
    .delete(rulebookCategories)
    .where(
      sql`not exists (select 1 from public.rulebooks r where r.category_id = ${rulebookCategories.id})`,
    );
}
