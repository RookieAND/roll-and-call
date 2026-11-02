import type { SessionGame } from "@/entities/game";
import { reviewEditDeadline, reviewWriteDeadline } from "@/entities/review";
import { ddayKst, formatDday } from "@/shared/lib";

import {
  SESSION_ACTION_KIND,
  type SessionCardModel,
  type SessionContext,
} from "./session-card-model";

type ReviewNote = Pick<SessionCardModel, "caption" | "action" | "scheduleNote">;

const NONE: ReviewNote = { caption: null, action: null, scheduleNote: null };

export function reviewNote({
  game,
  context,
}: {
  game: SessionGame;
  context: SessionContext;
}): ReviewNote {
  if (context.readOnly || !context.reviewedGames) return NONE;
  const now = context.now ?? new Date();
  const review = context.reviewedGames.get(game.id);

  if (review) {
    const editDeadline = reviewEditDeadline(review.createdAt);
    if (review.removedAt || editDeadline.getTime() <= now.getTime()) return NONE;
    return {
      ...NONE,
      action: {
        kind: SESSION_ACTION_KIND.viewReview,
        label: "내 후기 보기",
        href: "/me/reviews",
        badge: `수정 ${formatDday(ddayKst(editDeadline, now))}`,
      },
    };
  }

  const writeDeadline = reviewWriteDeadline(game);
  if (!writeDeadline) return NONE;
  if (writeDeadline.getTime() <= now.getTime()) {
    return { ...NONE, scheduleNote: "후기 작성 기간이 지났습니다" };
  }
  return {
    ...NONE,
    action: {
      kind: SESSION_ACTION_KIND.writeReview,
      label: "후기 쓰기",
      href: `/games/${game.id}/review`,
      badge: formatDday(ddayKst(writeDeadline, now)),
    },
  };
}
