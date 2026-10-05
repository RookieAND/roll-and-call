import { BADGE_ROLE } from "./badge-ladder";
import type { MonthlyAppearance } from "./monthly-appearance";
import { reviewScore } from "./review-score";

// 후기는 처음 공개한 시각(createdAt, 고쳐도 바뀌지 않는다)의 KST 달에 PL 점수로 센다.
// 후기 점수는 순위용이라 업적 후기 사다리와 따로 센다.
export function reviewAppearances(
  reviews: {
    authorId: string;
    createdAt: Date;
    body: string;
    hiddenAt: Date | null;
    removedAt: Date | null;
    authorAbsent: boolean;
  }[],
): MonthlyAppearance[] {
  return reviews.flatMap((review) => {
    const score = reviewScore(review);
    if (score === 0) return [];
    return [
      {
        userId: review.authorId,
        role: BADGE_ROLE.player,
        startsAt: review.createdAt,
        score,
        sessions: 0,
      },
    ];
  });
}
