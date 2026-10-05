// 제재·제재 해제·추방·차단 해제가 함께 쓰는 조치 사유. 키를 사유 코드로 저장한다.
export const USER_ACTION_REASON = {
  no_show: "반복된 불참",
  abuse: "욕설·비방",
  privacy: "개인정보 노출",
  impersonation: "부적절한 닉네임·사칭",
  spoiler: "스포일러 미표시",
  other: "기타",
} as const;

export type UserActionReason = keyof typeof USER_ACTION_REASON;
