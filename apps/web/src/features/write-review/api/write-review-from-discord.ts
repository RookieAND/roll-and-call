import "server-only";
import { evaluateBadges } from "@roll-and-call/database/badges";
import { REVIEW_AUTHOR_ROLE } from "@roll-and-call/database/games/model";
import { getUserIdByDiscordId } from "@roll-and-call/database/profiles";
import { insertReview, getReviewDraftTarget } from "@roll-and-call/database/reviews";
import { getActiveMembership, getServerByGuildId } from "@roll-and-call/database/servers";
import { after } from "next/server";

import { REVIEW_PHOTO_MAX_COUNT, reviewBodyError } from "@/entities/review";
import { uploadReviewPhotos } from "@/entities/review/server";
import { serverPath } from "@/shared/lib";
import { revalidateReviews, siteOrigin, syncReviewForumPost } from "@/shared/server";

import {
  DISCORD_REVIEW_REFUSAL,
  DISCORD_REVIEW_REFUSAL_MESSAGE,
} from "../model/discord-review-refusal";
import { discordReviewRefusalOf } from "../model/discord-review-refusal-of";
import {
  DISCORD_PHOTO_UPLOAD_FAILED_MESSAGE,
  PHOTO_ACCEPT,
  PHOTO_MAX_BYTES,
} from "../model/photo-rules";
import { MY_REVIEWS_HREF } from "../model/review-block";

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
  if (!server) return DISCORD_REVIEW_REFUSAL_MESSAGE[DISCORD_REVIEW_REFUSAL.serverNotFound];

  const userId = await getUserIdByDiscordId(discordId);
  if (!userId) return DISCORD_REVIEW_REFUSAL_MESSAGE[DISCORD_REVIEW_REFUSAL.notRegistered];
  const membership = await getActiveMembership({ serverId: server.id, userId });
  if (!membership) return DISCORD_REVIEW_REFUSAL_MESSAGE[DISCORD_REVIEW_REFUSAL.notServerMember];

  const text = body.trim();
  const bodyError = reviewBodyError(text);
  if (bodyError) {
    return `${bodyError}.`;
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
  const refusal = discordReviewRefusalOf(target);
  if (refusal) return DISCORD_REVIEW_REFUSAL_MESSAGE[refusal];
  if (!target) return DISCORD_REVIEW_REFUSAL_MESSAGE[DISCORD_REVIEW_REFUSAL.gameNotFound];

  let photoUrls: string[] = [];
  if (photos.length > 0) {
    try {
      photoUrls = await uploadReviewPhotos({
        serverId: server.id,
        userId,
        sources: photos.map(({ url, content_type }) => ({ url, contentType: content_type! })),
      });
    } catch (error) {
      console.error("디스코드 후기 사진 올리기 실패", { gameId, error });
      return DISCORD_PHOTO_UPLOAD_FAILED_MESSAGE;
    }
  }

  let reviewId: string | undefined;
  try {
    reviewId = await insertReview({
      serverId: server.id,
      gameId,
      authorId: userId,
      authorRole: target.isGm ? REVIEW_AUTHOR_ROLE.gm : REVIEW_AUTHOR_ROLE.participant,
      body: text,
      spoiler,
      photoUrls,
    });
  } catch (error) {
    if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
      return DISCORD_REVIEW_REFUSAL_MESSAGE[DISCORD_REVIEW_REFUSAL.alreadyWritten];
    }
    throw error;
  }

  if (!reviewId) {
    return "후기를 등록하지 못했습니다.\n쓴 글은 저장되지 않았으니 잠시 뒤에 다시 시도해 주세요.";
  }
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
