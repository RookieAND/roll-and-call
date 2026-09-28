"use server";

import { and, eq, isNull } from "drizzle-orm";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import {
  db,
  getCurrentUser,
  removeUnusedReviewPhotos,
  revalidateReviews,
  reviewReports,
  sessionReviews,
} from "@/shared/server";

// 행은 남겨 같은 세션에 다시 쓰지 못하게 하고, 본문·사진은 비운다. 남은 신고는 대상이 없어 기각으로 닫는다.
export async function deleteReview(reviewId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const now = new Date();
  const deleted = await db.transaction(async (transaction) => {
    const [review] = await transaction
      .select({ gameId: sessionReviews.gameId, photoUrls: sessionReviews.photoUrls })
      .from(sessionReviews)
      .where(
        and(
          eq(sessionReviews.id, reviewId),
          eq(sessionReviews.authorId, user.id),
          isNull(sessionReviews.removedAt),
        ),
      )
      .for("update");
    if (!review) return null;

    await transaction
      .update(sessionReviews)
      .set({ removedAt: now, body: "", photoUrls: [] })
      .where(eq(sessionReviews.id, reviewId));
    await transaction
      .update(reviewReports)
      .set({ outcome: "dismissed", resolvedAt: now })
      .where(and(eq(reviewReports.reviewId, reviewId), isNull(reviewReports.outcome)));
    return review;
  });
  if (!deleted) return { error: "이미 삭제된 후기입니다." };

  await removeUnusedReviewPhotos(deleted.photoUrls);
  revalidateReviews(deleted.gameId);
  return {};
}
