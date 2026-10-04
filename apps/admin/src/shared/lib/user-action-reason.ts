export const OTHER_REASON = "기타";

// 제재·제재 해제·추방·차단 해제가 함께 쓰는 조치 사유 칩. 저장하는 사유는 칩 이름이고, 기타면 입력한 글이다.
export const USER_ACTION_REASON = [
  "반복된 불참",
  "욕설·비방",
  "개인정보 노출",
  "부적절한 닉네임·사칭",
  "스포일러 미표시",
  OTHER_REASON,
] as const;
export type UserActionReason = (typeof USER_ACTION_REASON)[number];
