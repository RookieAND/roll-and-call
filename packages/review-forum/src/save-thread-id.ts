import { db, sessionReviews } from "@roll-and-call/database";
import { eq } from "drizzle-orm";

export async function saveThreadId(reviewId: string, threadId: string | null) {
  await db
    .update(sessionReviews)
    .set({ discordThreadId: threadId })
    .where(eq(sessionReviews.id, reviewId));
}
