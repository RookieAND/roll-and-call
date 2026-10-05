const REVIEW_SCORE = 10;
const REVIEW_MIN_LENGTH = 10;

// 공개 상태(숨김·제거·불참 보류가 아님)이고 공백을 뺀 본문이 10자 이상인 후기만 점수를 준다.
export function reviewScore(review: {
  body: string;
  hiddenAt: Date | null;
  removedAt: Date | null;
  authorAbsent: boolean;
}): number {
  if (review.hiddenAt || review.removedAt || review.authorAbsent) return 0;
  return review.body.replace(/\s/g, "").length >= REVIEW_MIN_LENGTH ? REVIEW_SCORE : 0;
}
