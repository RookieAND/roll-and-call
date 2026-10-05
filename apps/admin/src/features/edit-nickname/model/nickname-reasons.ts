// 닉네임 수정 전용 사유(21번 r3 3장). 키가 사유 코드이고, 기타면 입력한 글이 함께 간다.
export const NICKNAME_REASON = {
  impersonation: "운영진 사칭",
  inappropriate: "부적절한 표현",
  privacy: "개인정보 노출",
  requested: "본인 요청",
  other: "기타",
} as const;
