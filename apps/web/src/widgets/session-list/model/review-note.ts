import { reviewEditDeadline, reviewWriteDeadline } from "@/entities/review";
import { ddayKst } from "@/shared/lib";

import {
  SESSION_ACTION_KIND,
  type SessionCardModel,
  type SessionContext,
  type SessionGame,
} from "./session-card-model";

type ReviewNote = Pick<SessionCardModel, "caption" | "action">;

const NONE: ReviewNote = { caption: null, action: null };

const dday = (days: number) => (days > 0 ? `D-${days}` : "D-day");

export function reviewNote(game: SessionGame, context: SessionContext): ReviewNote {
  if (context.readOnly || !context.reviewedGames) return NONE;
  if (!game.attendanceConfirmedAt) {
    return { ...NONE, caption: { text: "GM 확인 대기", strong: false } };
  }
  const now = context.now ?? new Date();
  const review = context.reviewedGames.get(game.id);

  if (review) {
    const editDeadline = reviewEditDeadline(review.createdAt);
    if (review.removedAt || editDeadline.getTime() <= now.getTime()) return NONE;
    return {
      caption: { text: `수정 가능 · ${dday(ddayKst(editDeadline, now))}`, strong: false },
      action: { kind: SESSION_ACTION_KIND.viewReview, label: "내 후기 보기", href: "/me/reviews" },
    };
  }

  const writeDeadline = reviewWriteDeadline(game.attendanceConfirmedAt);
  if (writeDeadline.getTime() <= now.getTime()) {
    return { ...NONE, caption: { text: "작성 기간 지남", strong: false } };
  }
  return {
    caption: { text: `후기 마감 ${dday(ddayKst(writeDeadline, now))}`, strong: true },
    action: {
      kind: SESSION_ACTION_KIND.writeReview,
      label: "후기 쓰기",
      href: `/games/${game.id}/review`,
    },
  };
}
