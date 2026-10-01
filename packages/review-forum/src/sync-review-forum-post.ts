import {
  createForumPost,
  deleteDiscordThread,
  getForumTags,
  updateForumPost,
} from "@roll-and-call/discord";

import { fetchPhotoFiles } from "./fetch-photo-files";
import { loadForumReview } from "./load-forum-review";
import { reviewForumPost } from "./review-forum-post";
import { saveThreadId } from "./save-thread-id";

const FORUM_CHANNEL_ENV = "DISCORD_REVIEW_FORUM_CHANNEL_ID";

// ponytail: 같은 후기를 동시에 두 번 부르면 게시글이 둘 생길 수 있다. 작성·수정은 한 사람이 하므로 드물다.
export async function syncReviewForumPost({
  reviewId,
  siteOrigin,
}: {
  reviewId: string;
  siteOrigin: string | undefined;
}) {
  const forumId = process.env[FORUM_CHANNEL_ENV];
  if (!forumId) return;
  const review = await loadForumReview(reviewId);
  if (!review) return;

  const held = Boolean(review.absent) && review.absenceCancelledAt === null;
  const visible = !review.removedAt && !review.hiddenAt && !held;
  if (!visible) {
    if (review.threadId) {
      await deleteDiscordThread(review.threadId);
      await saveThreadId({ reviewId, threadId: null });
    }
    return;
  }

  const { photos, ...post } = reviewForumPost({
    review,
    tagIds: await getForumTags(forumId),
    siteOrigin,
  });
  const input = { ...post, files: await fetchPhotoFiles(photos) };
  if (review.threadId && (await updateForumPost({ threadId: review.threadId, ...input }))) return;
  // 고칠 수 없는 게시글(누가 지웠거나 첨부 수정이 막힘)은 지우고 새로 올린다.
  if (review.threadId) await deleteDiscordThread(review.threadId);
  const threadId = await createForumPost({ forumId, ...input });
  await saveThreadId({ reviewId, threadId: threadId ?? null });
}
