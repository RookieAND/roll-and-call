import { OTHER_REASON } from "./user-action-reason";

// 인증 심사 반려와 반려로 돌리기가 함께 쓰는 사유 목록.
export interface RejectReason {
  // 사유 이름은 사유 태그다. 사용자 신청 화면의 반려 요약과 알림에도 보인다.
  name: string;
  // 고르면 「사용자에게 보이는 사유」에 미리 채우는 문장(시안 cert_reject 문장)
  message: string;
}

export const REJECT_REASONS: readonly RejectReason[] = [
  {
    name: "닉네임 쪽지가 없거나 닉네임이 다릅니다",
    message: "쪽지에 디스코드 닉네임이 없거나 신청자와 다릅니다.",
  },
  {
    name: "사진이 잘렸거나 흐려서 확인할 수 없습니다",
    message: "사진이 잘렸거나 흐려서 책을 확인할 수 없습니다.",
  },
  { name: "신청한 판본과 다른 책입니다", message: "신청한 판본과 다른 책입니다." },
  {
    name: "실물이 아니라 화면이나 인쇄물입니다",
    message: "실물 책이 아니라 화면이나 인쇄물로 보입니다.",
  },
  { name: "추가 확인이 필요합니다", message: "추가 확인이 필요합니다." },
  { name: OTHER_REASON, message: "" },
];

export const EBOOK_REJECT_REASONS: readonly RejectReason[] = [
  {
    name: "상품명이나 주문번호가 보이지 않습니다",
    message: "구매 내역에서 상품명이나 주문번호를 확인할 수 없습니다.",
  },
  { name: "취소·환불된 주문입니다", message: "취소 또는 환불된 주문입니다." },
  {
    name: "이미 다른 신청에 쓰인 주문번호입니다",
    message: "이미 다른 신청에 쓰인 주문번호입니다.",
  },
  {
    name: "영수증과 구매 내역이 서로 다릅니다",
    message: "영수증과 구매 내역의 내용이 서로 다릅니다.",
  },
  { name: "추가 확인이 필요합니다", message: "추가 확인이 필요합니다." },
];
