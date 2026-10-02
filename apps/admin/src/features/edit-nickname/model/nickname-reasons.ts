export const OTHER_NICKNAME_REASON = "기타";

export const NICKNAME_REASONS = [
  "운영진 사칭",
  "부적절한 표현",
  "개인정보 노출",
  "본인 요청",
  OTHER_NICKNAME_REASON,
] as const;
export type NicknameReason = (typeof NICKNAME_REASONS)[number];
