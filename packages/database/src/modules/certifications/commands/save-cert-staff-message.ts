import { and, eq, inArray } from "drizzle-orm";

import { db } from "#db/client";
import { certApplications } from "#db/schema";

export async function saveCertStaffMessage({
  serverId,
  applicationIds,
  messageId,
}: {
  serverId: string;
  applicationIds: string[];
  messageId: string;
}) {
  await db
    .update(certApplications)
    .set({ staffMessageId: messageId })
    .where(
      and(eq(certApplications.serverId, serverId), inArray(certApplications.id, applicationIds)),
    );
}
