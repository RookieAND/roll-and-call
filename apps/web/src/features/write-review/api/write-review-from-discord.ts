import "server-only";
import { getUserIdByDiscordId } from "@roll-and-call/database/profiles";
import { insertReview } from "@roll-and-call/database/reviews";
import { getActiveMembership, getServerByGuildId } from "@roll-and-call/database/servers";
import { after } from "next/server";

import { REVIEW_BODY_MIN_LENGTH, REVIEW_PHOTO_MAX_COUNT } from "@/entities/review";
import { richTextLength, serverPath } from "@/shared/lib";
import {
  evaluateBadges,
  getReviewDraftTarget,
  revalidateReviews,
  siteOrigin,
  syncReviewForumPost,
  uploadReviewPhotos,
} from "@/shared/server";

import { PHOTO_ACCEPT, PHOTO_MAX_BYTES } from "../model/photo-rules";
import { MY_REVIEWS_HREF, REVIEW_BLOCK, REVIEW_BLOCK_DIALOG } from "../model/review-block";
import { reviewBlockOf } from "../model/review-block-of";

const UNIQUE_VIOLATION = "23505";

// 디스코드 모달로 온 후기. discordId는 서명을 확인한 인터랙션에서 온 값이라 그대로 믿는다. 사진·스포일러·수정은 웹에서 한다.
export async function writeReviewFromDiscord({
  guildId,
  discordId,
  gameId,
  body,
  spoiler,
  photos,
}: {
  guildId: string;
  discordId: string;
  gameId: string;
  body: string;
  spoiler: boolean;
  photos: { url: string; content_type?: string; size: number }[];
}): Promise<string> {
  const server = await getServerByGuildId(guildId);
  if (!server) return "이 서버에서는 후기를 쓸 수 없습니다.";

  const userId = await getUserIdByDiscordId(discordId);
  const membership = userId && (await getActiveMembership({ serverId: server.id, userId }));
  if (!userId || !membership) return "아직 가입하지 않았습니다. 가입한 뒤 후기를 써 주세요.";

  const text = body.trim();
  if (richTextLength(text) < REVIEW_BODY_MIN_LENGTH) {
    return `${REVIEW_BODY_MIN_LENGTH}자 이상 적어 주세요.`;
  }

  if (photos.length > REVIEW_PHOTO_MAX_COUNT) {
    return `사진은 ${REVIEW_PHOTO_MAX_COUNT}장까지 올릴 수 있습니다.`;
  }
  const acceptedTypes = PHOTO_ACCEPT.split(",");
  if (photos.some(({ content_type }) => !content_type || !acceptedTypes.includes(content_type))) {
    return "JPG·PNG·WebP 사진만 올릴 수 있습니다.";
  }
  if (photos.some(({ size }) => size > PHOTO_MAX_BYTES)) {
    return "5MB를 넘는 사진은 올릴 수 없습니다.";
  }

  const target = await getReviewDraftTarget({ serverId: server.id, gameId, userId });
  if (!target) return blockMessage(REVIEW_BLOCK.unavailable);
  if (target.review) return blockMessage(REVIEW_BLOCK.alreadyWritten);
  const block = reviewBlockOf(target);
  if (block) return blockMessage(block);

  const photoUrls =
    photos.length === 0
      ? []
      : await uploadReviewPhotos({
          serverId: server.id,
          userId,
          sources: photos.map(({ url, content_type }) => ({ url, contentType: content_type! })),
        });

  let reviewId: string | undefined;
  try {
    reviewId = await insertReview({
      serverId: server.id,
      gameId,
      authorId: userId,
      body: text,
      spoiler,
      photoUrls,
    });
  } catch (error) {
    if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
      return blockMessage(REVIEW_BLOCK.alreadyWritten);
    }
    throw error;
  }

  if (!reviewId) return "후기를 등록하지 못했습니다. 잠시 뒤에 다시 시도해 주세요.";
  const createdReviewId = reviewId;
  revalidateReviews({ slug: server.slug, gameId });
  after(() =>
    syncReviewForumPost({
      serverId: server.id,
      reviewId: createdReviewId,
      siteOrigin: siteOrigin(),
    }),
  );
  after(() => evaluateBadges({ serverId: server.id, userIds: [target.game.gmId, userId] }));

  const url = `${siteOrigin() ?? ""}${serverPath({ slug: server.slug, path: MY_REVIEWS_HREF })}`;
  return `후기를 등록했습니다. 사진을 고치거나 더하려면 ${url}`;
}

function blockMessage(block: keyof typeof REVIEW_BLOCK_DIALOG) {
  const { title, description } = REVIEW_BLOCK_DIALOG[block];
  return `${title}. ${description}`;
}
