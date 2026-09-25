import "server-only";
import { rulebookCategories } from "@roll-and-call/database";
import { sql } from "drizzle-orm";

import type { Executor } from "./record-audit";

// 책이 모두 다른 카테고리로 옮겨 간 카테고리를 지운다.
export async function removeEmptyCategories(tx: Executor) {
  await tx
    .delete(rulebookCategories)
    .where(
      sql`not exists (select 1 from public.rulebooks r where r.category_id = ${rulebookCategories.id})`,
    );
}
