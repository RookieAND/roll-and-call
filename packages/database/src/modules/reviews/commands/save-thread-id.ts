import { and, eq } from "drizzle-orm";

import { db } from "#db/client";
import { sessionReviews } from "#db/schema";

export async function saveThreadId({
  serverId,
  reviewId,
  threadId,
}: {
  serverId: string;
  reviewId: string;
  threadId: string | null;
}) {
  await db
    .update(sessionReviews)
    .set({ discordThreadId: threadId })
    .where(and(eq(sessionReviews.serverId, serverId), eq(sessionReviews.id, reviewId)));
}
