import { and, eq, inArray, sql } from "drizzle-orm";

import { db } from "#db/client";
import { certApplications } from "#db/schema";

export async function markCertStaffMessagesSynced({
  serverId,
  applicationIds,
}: {
  serverId: string;
  applicationIds: string[];
}) {
  if (applicationIds.length === 0) return;
  await db
    .update(certApplications)
    .set({ staffMessageSyncedAt: sql`now()` })
    .where(
      and(eq(certApplications.serverId, serverId), inArray(certApplications.id, applicationIds)),
    );
}
