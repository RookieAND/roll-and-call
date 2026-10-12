import { PARTICIPANT_STATUS } from "@/entities/game";
import type { ReviewDraftTarget } from "@/shared/server";

import { DISCORD_REVIEW_REFUSAL, type DiscordReviewRefusal } from "./discord-review-refusal";
import { REVIEW_BLOCK } from "./review-block";
import { reviewBlockOf } from "./review-block-of";

// 디스코드에서 후기를 쓸 수 없는 이유를 웹의 막힘 사유보다 잘게 나눈다. 쓸 수 있으면 null이다.
export function discordReviewRefusalOf(
  target: ReviewDraftTarget | null,
  now: Date = new Date(),
): DiscordReviewRefusal | null {
  if (!target) return DISCORD_REVIEW_REFUSAL.gameNotFound;
  if (target.review) return DISCORD_REVIEW_REFUSAL.alreadyWritten;

  const block = reviewBlockOf(target, now);
  if (block !== REVIEW_BLOCK.unavailable) return block;
  if (target.isGm) return DISCORD_REVIEW_REFUSAL.noAttendee;
  if (!target.participant) return DISCORD_REVIEW_REFUSAL.notParticipant;
  if (target.participant.status === PARTICIPANT_STATUS.removed) {
    return DISCORD_REVIEW_REFUSAL.removed;
  }
  return DISCORD_REVIEW_REFUSAL.notConfirmed;
}
