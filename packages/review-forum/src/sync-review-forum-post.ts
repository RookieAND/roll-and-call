import {
  createForumPost,
  deleteDiscordThread,
  getForumTags,
  updateForumPost,
} from "@roll-and-call/discord";

import { loadForumReview } from "./load-forum-review";
import { reviewForumPost } from "./review-forum-post";
import { saveThreadId } from "./save-thread-id";

const FORUM_CHANNEL_ENV = "DISCORD_REVIEW_FORUM_CHANNEL_ID";

// 후기가 바뀐 뒤 부른다. 공개 후기면 포럼 게시글을 만들거나 고치고, 숨김·제거·보류면 지운다.
// ponytail: 같은 후기를 동시에 두 번 부르면 게시글이 둘 생길 수 있다. 작성·수정은 한 사람이 하므로 드물다.
export async function syncReviewForumPost(reviewId: string, siteOrigin: string | undefined) {
  const forumId = process.env[FORUM_CHANNEL_ENV];
  if (!forumId) return;
  const review = await loadForumReview(reviewId);
  if (!review) return;

  const held = Boolean(review.absent) && review.absenceCancelledAt === null;
  const visible = !review.removedAt && !review.hiddenAt && !held;
  if (!visible) {
    if (review.threadId) {
      await deleteDiscordThread(review.threadId);
      await saveThreadId(reviewId, null);
    }
    return;
  }

  const post = reviewForumPost(review, await getForumTags(forumId), siteOrigin);
  if (review.threadId && (await updateForumPost(review.threadId, post))) return;
  const threadId = await createForumPost(forumId, post);
  if (threadId) await saveThreadId(reviewId, threadId);
}
