import { and, eq, sql } from "drizzle-orm";

import { rulebookCategories } from "../../../schema";
import type { Executor } from "../../moderation/commands/record-audit";

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
