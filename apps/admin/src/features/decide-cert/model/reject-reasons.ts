export const REJECT_REASONS = [
  "닉네임 쪽지가 없거나 달라요",
  "사진이 잘렸거나 흐려요",
  "판본이 달라요",
  "실물이 아니에요(화면·인쇄물)",
  "신청한 책과 달라요",
] as const;

// 전자책은 판단하기 어려우면 "추가 확인이 필요해요"를 고르고 사유에 요청할 내용을 적으므로 기타가 없다.
export const EBOOK_REJECT_REASONS = [
  "상품명이나 주문번호가 보이지 않아요",
  "취소·환불된 주문이에요",
  "이미 다른 신청에 쓰인 주문번호예요",
  "영수증과 구매 내역이 서로 달라요",
  "추가 확인이 필요해요",
] as const;

export const OTHER_REASON = "기타" as const;
