import { and, eq, isNull, sql } from "drizzle-orm";

import { db } from "../../client";
import { rulebookRequests } from "../../schema";

export async function hasPendingRulebookRequest({
  serverId,
  name,
  edition,
}: {
  serverId: string;
  name: string;
  edition: string;
}) {
  const [duplicate] = await db
    .select({ id: rulebookRequests.id })
    .from(rulebookRequests)
    .where(
      and(
        eq(rulebookRequests.serverId, serverId),
        isNull(rulebookRequests.outcome),
        sql`lower(trim(${rulebookRequests.name} || ' ' || ${rulebookRequests.edition})) = lower(trim(${`${name} ${edition}`}))`,
      ),
    );
  return Boolean(duplicate);
}
