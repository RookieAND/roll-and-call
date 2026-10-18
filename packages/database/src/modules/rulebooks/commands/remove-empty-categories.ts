import { and, eq, sql } from "drizzle-orm";

import type { Executor } from "#db/modules/transaction";
import { rulebookCategories } from "#db/schema";

export async function removeEmptyCategories({
  executor,
  serverId,
}: {
  executor: Executor;
  serverId: string;
}) {
  await executor
    .delete(rulebookCategories)
    .where(
      and(
        eq(rulebookCategories.serverId, serverId),
        sql`not exists (select 1 from public.rulebooks r where r.category_id = ${rulebookCategories.id})`,
      ),
    );
}
