export const REVIEW_REASON = {
  abuse: "욕설·비방",
  privacy: "개인정보 노출",
  spoiler: "스포일러 미표시",
  image: "부적절한 이미지",
  unrelated: "세션과 무관한 내용",
  other: "기타",
} as const;

export type ReviewReason = keyof typeof REVIEW_REASON;

export const REVIEW_REASONS = Object.keys(REVIEW_REASON) as ReviewReason[];

export const reviewReasonLabel = (key: string) => REVIEW_REASON[key as ReviewReason] ?? key;
