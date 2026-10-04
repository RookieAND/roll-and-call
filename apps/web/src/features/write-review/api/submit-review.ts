"use server";

import { insertReview, updateReview } from "@roll-and-call/database/reviews";
import { redirect } from "next/navigation";
import { after } from "next/server";

import {
  REVIEW_BODY_MAX_LENGTH,
  REVIEW_BODY_MIN_LENGTH,
  REVIEW_PHOTO_MAX_COUNT,
} from "@/entities/review";
import { type ActionResult } from "@/shared/api";
import { reviewPhotoPathOf, serverPath } from "@/shared/lib";
import {
  getActingMember,
  getReviewDraftTarget,
  removeUnusedReviewPhotos,
  revalidateReviews,
  siteOrigin,
  syncReviewForumPost,
  notMemberError,
} from "@/shared/server";

import { MY_REVIEWS_HREF, REVIEW_BLOCK, type ReviewBlock } from "../model/review-block";
import { reviewBlockOf } from "../model/review-block-of";
import type { ReviewFormInput } from "../model/review-form-input";

export type SubmitReviewResult = ActionResult & { block?: ReviewBlock };

const UNIQUE_VIOLATION = "23505";
// 막힌 결과는 토스트 대신 대화상자로 알리므로 이 문구는 보이지 않는다.
const REVIEW_BLOCK_ERROR = "후기를 등록하지 못했습니다.";

export async function submitReview(input: ReviewFormInput): Promise<SubmitReviewResult> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  const body = input.body.trim();
  if (body.length < REVIEW_BODY_MIN_LENGTH)
    return { error: "20자 이상 적어 주세요", field: "body" };
  if (body.length > REVIEW_BODY_MAX_LENGTH)
    return { error: "2,000자까지 쓸 수 있습니다", field: "body" };
  // 옛 경로(내 id/…)와 서버별 경로(servers/서버 id/내 id/…) 둘 다 내 사진이다.
  const ownPrefixes = [`${user.id}/`, `servers/${server.id}/${user.id}/`];
  const ownPhotos = input.photoUrls.every((url) => {
    const path = reviewPhotoPathOf(url);
    return ownPrefixes.some((prefix) => path?.startsWith(prefix));
  });
  if (!ownPhotos || input.photoUrls.length > REVIEW_PHOTO_MAX_COUNT) {
    return { error: "사진을 다시 올려 주세요." };
  }

  const target = await getReviewDraftTarget({
    serverId: server.id,
    gameId: input.gameId,
    userId: user.id,
  });
  if (!target) return { error: REVIEW_BLOCK_ERROR, block: REVIEW_BLOCK.unavailable };
  if (target.review && target.review.id !== input.reviewId) {
    return { error: REVIEW_BLOCK_ERROR, block: REVIEW_BLOCK.alreadyWritten };
  }
  const block = reviewBlockOf(target);
  if (block) return { error: REVIEW_BLOCK_ERROR, block };

  const values = { body, spoiler: input.spoiler, photoUrls: input.photoUrls };
  let reviewId = target.review?.id;
  if (target.review) {
    await updateReview({ serverId: server.id, reviewId: target.review.id, ...values });
    await removeUnusedReviewPhotos(
      target.review.photoUrls.filter((url) => !input.photoUrls.includes(url)),
    );
  } else {
    try {
      reviewId = await insertReview({
        serverId: server.id,
        gameId: input.gameId,
        authorId: user.id,
        ...values,
      });
    } catch (error) {
      if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
        return { error: REVIEW_BLOCK_ERROR, block: REVIEW_BLOCK.alreadyWritten };
      }
      throw error;
    }
  }

  revalidateReviews({ slug: server.slug, gameId: input.gameId });
  if (reviewId) {
    const createdReviewId = reviewId;
    after(() =>
      syncReviewForumPost({
        serverId: server.id,
        reviewId: createdReviewId,
        siteOrigin: siteOrigin(),
      }),
    );
  }
  redirect(serverPath({ slug: server.slug, path: MY_REVIEWS_HREF }));
}
