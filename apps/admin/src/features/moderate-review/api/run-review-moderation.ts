import "server-only";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import {
  getCurrentServer,
  moderateReview,
  requireStaff,
  syncReviewForumPost,
  type ReviewModerationAction,
} from "@/shared/server";

interface RunReviewModerationOptions {
  staff: Awaited<ReturnType<typeof requireStaff>>;
  reviewId: string;
  action: ReviewModerationAction;
  reason: string;
}

// 알림은 moderateReview가 같은 트랜잭션에서 넣는다. 디스코드 DM은 보내지 않고, 포럼 글만 지금처럼 맞춘다.
export async function runReviewModeration({
  staff,
  reviewId,
  action,
  reason,
}: RunReviewModerationOptions) {
  const server = await getCurrentServer();
  const result = await moderateReview({
    serverId: server.id,
    id: reviewId,
    actor: staff,
    moderation: { action, reason },
  });
  revalidatePath("/", "layout");
  if (result.ok) {
    after(() =>
      syncReviewForumPost({
        serverId: server.id,
        reviewId,
        siteOrigin: process.env.NEXT_PUBLIC_USER_APP_URL,
      }),
    );
  }
  return result;
}
