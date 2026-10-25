import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { rulebookRequests } from "#db/schema";

export async function saveRulebookRequestStaffMessage({
  serverId,
  id,
  messageId,
}: {
  serverId: string;
  id: string;
  messageId: string;
}) {
  await db
    .update(rulebookRequests)
    .set({ staffMessageId: messageId })
    .where(and(eq(rulebookRequests.serverId, serverId), eq(rulebookRequests.id, id)));
}
