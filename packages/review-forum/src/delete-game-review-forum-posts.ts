import { db, sessionReviews } from "@roll-and-call/database";
import { deleteDiscordThread } from "@roll-and-call/discord";
import { and, eq, isNotNull } from "drizzle-orm";

// 구인을 지우면 후기 행이 cascade로 사라져 스레드 id를 잃는다. 지우기 전에 부른다.
export async function deleteGameReviewForumPosts(gameId: string) {
  const reviews = await db
    .select({ threadId: sessionReviews.discordThreadId })
    .from(sessionReviews)
    .where(and(eq(sessionReviews.gameId, gameId), isNotNull(sessionReviews.discordThreadId)));
  for (const review of reviews) await deleteDiscordThread(review.threadId!);
}
