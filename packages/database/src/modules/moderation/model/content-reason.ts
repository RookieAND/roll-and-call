// 구인 숨김·구인 취소·후기 숨김·후기 제거가 함께 쓰는 조치 사유(시안 MOD_REASONS). 키를 사유 코드로 저장한다.
export const CONTENT_REASON = {
  abuse: "욕설·비방",
  privacy: "개인정보 노출",
  spoiler: "스포일러 미표시",
  image: "부적절한 이미지",
  unrelated: "세션과 무관한 내용",
  other: "기타",
} as const;

export type ContentReason = keyof typeof CONTENT_REASON;
