"use server";

import { removeOwnReview } from "@roll-and-call/database/reviews";
import { after } from "next/server";

import { AUTH_REQUIRED_MESSAGE, type ActionResult } from "@/shared/api";
import {
  evaluateGameBadges,
  getCurrentServer,
  getCurrentUser,
  removeUnusedReviewPhotos,
  revalidateReviews,
  siteOrigin,
  syncReviewForumPost,
} from "@/shared/server";

// 행은 남겨 같은 세션에 다시 쓰지 못하게 하고, 본문·사진은 비운다. 남은 신고는 대상이 없어 기각으로 닫는다.
export async function deleteReview(reviewId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { error: AUTH_REQUIRED_MESSAGE };

  const server = await getCurrentServer();
  const deleted = await removeOwnReview({ serverId: server.id, reviewId, authorId: user.id });
  if (!deleted) return { error: "이미 삭제된 후기입니다." };

  await removeUnusedReviewPhotos(deleted.photoUrls);
  revalidateReviews({ slug: server.slug, gameId: deleted.gameId });
  after(() => syncReviewForumPost({ serverId: server.id, reviewId, siteOrigin: siteOrigin() }));
  after(() => evaluateGameBadges({ serverId: server.id, gameId: deleted.gameId }));
  return {};
}
