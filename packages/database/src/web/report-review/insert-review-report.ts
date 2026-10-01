import { db } from "../../client";
import { reviewReports, type ReviewReport } from "../../schema";

// 같은 사람이 두 번 신고하면 유니크 제약 위반(23505)을 그대로 던진다.
export async function insertReviewReport({
  serverId,
  reviewId,
  reporterId,
  category,
  detail,
}: {
  serverId: string;
  reviewId: string;
  reporterId: string;
  category: ReviewReport["category"];
  detail: string;
}) {
  await db.insert(reviewReports).values({ serverId, reviewId, reporterId, category, detail });
}
