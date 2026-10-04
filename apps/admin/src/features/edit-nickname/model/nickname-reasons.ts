import { OTHER_REASON } from "@/shared/lib";

// 닉네임 수정 전용 사유 칩(21번 r3 3장). 저장하는 사유는 칩 이름이고, 기타면 입력한 글이다.
export const NICKNAME_REASONS = [
  "운영진 사칭",
  "부적절한 표현",
  "개인정보 노출",
  "본인 요청",
  OTHER_REASON,
] as const;
export type NicknameReason = (typeof NICKNAME_REASONS)[number];
