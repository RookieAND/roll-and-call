"use server";

import { and, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { after } from "next/server";

import {
  REVIEW_BODY_MAX_LENGTH,
  REVIEW_BODY_MIN_LENGTH,
  REVIEW_PHOTO_MAX_COUNT,
} from "@/entities/review";
import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import { reviewPhotoPathOf } from "@/shared/lib";
import {
  db,
  getCurrentUser,
  getReviewDraftTarget,
  removeUnusedReviewPhotos,
  evaluateBadges,
  revalidateReviews,
  sessionReviews,
  siteOrigin,
  syncReviewForumPost,
} from "@/shared/server";

import { MY_REVIEWS_HREF, REVIEW_BLOCK, type ReviewBlock } from "../model/review-block";
import { reviewBlockOf } from "../model/review-block-of";
import type { ReviewFormInput } from "../model/review-form-input";

export type SubmitReviewResult = ActionResult & { block?: ReviewBlock };

const UNIQUE_VIOLATION = "23505";
// 막힌 결과는 토스트 대신 대화상자로 알리므로 이 문구는 보이지 않는다.
const REVIEW_BLOCK_ERROR = "후기를 등록하지 못했습니다.";

export async function submitReview(input: ReviewFormInput): Promise<SubmitReviewResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const body = input.body.trim();
  if (body.length < REVIEW_BODY_MIN_LENGTH)
    return { error: "20자 이상 적어 주세요", field: "body" };
  if (body.length > REVIEW_BODY_MAX_LENGTH)
    return { error: "2,000자까지 쓸 수 있습니다", field: "body" };
  const ownPhotos = input.photoUrls.every((url) =>
    reviewPhotoPathOf(url)?.startsWith(`${user.id}/`),
  );
  if (!ownPhotos || input.photoUrls.length > REVIEW_PHOTO_MAX_COUNT) {
    return { error: "사진을 다시 올려 주세요." };
  }

  const target = await getReviewDraftTarget(input.gameId, user.id);
  if (!target) return { error: REVIEW_BLOCK_ERROR, block: REVIEW_BLOCK.unavailable };
  if (target.review && target.review.id !== input.reviewId) {
    return { error: REVIEW_BLOCK_ERROR, block: REVIEW_BLOCK.alreadyWritten };
  }
  const block = reviewBlockOf(target);
  if (block) return { error: REVIEW_BLOCK_ERROR, block };

  const values = { body, spoiler: input.spoiler, photoUrls: input.photoUrls };
  let reviewId = target.review?.id;
  if (target.review) {
    await db
      .update(sessionReviews)
      .set({ ...values, updatedAt: new Date() })
      .where(and(eq(sessionReviews.id, target.review.id), isNull(sessionReviews.removedAt)));
    await removeUnusedReviewPhotos(
      target.review.photoUrls.filter((url) => !input.photoUrls.includes(url)),
    );
  } else {
    try {
      const [created] = await db
        .insert(sessionReviews)
        .values({ ...values, gameId: input.gameId, authorId: user.id })
        .returning({ id: sessionReviews.id });
      reviewId = created?.id;
    } catch (error) {
      if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
        return { error: REVIEW_BLOCK_ERROR, block: REVIEW_BLOCK.alreadyWritten };
      }
      throw error;
    }
  }

  revalidateReviews(input.gameId);
  if (reviewId) {
    const createdReviewId = reviewId;
    after(() => syncReviewForumPost(createdReviewId, siteOrigin()));
  }
  if (!target.review) after(() => evaluateBadges([target.game.gmId]));
  redirect(MY_REVIEWS_HREF);
}
