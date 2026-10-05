"use server";

import { removeOwnReview } from "@roll-and-call/database/reviews";
import { after } from "next/server";

import { type ActionResult } from "@/shared/api";
import {
  evaluateGameBadges,
  getActingMember,
  removeUnusedReviewPhotos,
  revalidateReviews,
  siteOrigin,
  syncReviewForumPost,
  notMemberError,
} from "@/shared/server";

// 행은 남겨 같은 세션에 다시 쓰지 못하게 하고, 본문·사진은 비운다.
export async function deleteReview(reviewId: string): Promise<ActionResult> {
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  const deleted = await removeOwnReview({ serverId: server.id, reviewId, authorId: user.id });
  if (!deleted) return { error: "이미 삭제된 후기입니다." };

  await removeUnusedReviewPhotos(deleted.photoUrls);
  revalidateReviews({ slug: server.slug, gameId: deleted.gameId });
  after(() => syncReviewForumPost({ serverId: server.id, reviewId, siteOrigin: siteOrigin() }));
  after(() => evaluateGameBadges({ serverId: server.id, gameId: deleted.gameId }));
  return {};
}
