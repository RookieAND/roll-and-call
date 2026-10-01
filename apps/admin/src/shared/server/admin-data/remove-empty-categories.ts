import "server-only";
import { rulebookCategories } from "@roll-and-call/database";
import { sql } from "drizzle-orm";

import type { Executor } from "./record-audit";

export async function removeEmptyCategories(tx: Executor) {
  await tx
    .delete(rulebookCategories)
    .where(
      sql`not exists (select 1 from public.rulebooks r where r.category_id = ${rulebookCategories.id})`,
    );
}
