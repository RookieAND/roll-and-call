import { db, sessionReviews } from "@roll-and-call/database";
import { eq } from "drizzle-orm";

import { syncReviewForumPost } from "./sync-review-forum-post";

// 출석을 고치면 작성자의 보류 여부가 바뀌므로 그 세션의 후기를 모두 다시 맞춘다.
export async function syncGameReviewForumPosts(gameId: string, siteOrigin: string | undefined) {
  const reviews = await db
    .select({ id: sessionReviews.id })
    .from(sessionReviews)
    .where(eq(sessionReviews.gameId, gameId));
  for (const review of reviews) await syncReviewForumPost(review.id, siteOrigin);
}
