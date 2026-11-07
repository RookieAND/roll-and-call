import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { homebrewRuleApplications } from "#db/schema";

export async function saveHomebrewStaffMessage({
  serverId,
  id,
  messageId,
}: {
  serverId: string;
  id: string;
  messageId: string;
}) {
  await db
    .update(homebrewRuleApplications)
    .set({ staffMessageId: messageId })
    .where(
      and(eq(homebrewRuleApplications.serverId, serverId), eq(homebrewRuleApplications.id, id)),
    );
}
