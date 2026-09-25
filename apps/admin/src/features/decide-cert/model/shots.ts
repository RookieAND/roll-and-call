import type { ShotKey } from "@/shared/server";

// 심사 화면에서 확인하는 자료 한 칸. 실물은 사진 3장, 전자책은 구매 내역·영수증 2장이다.
export interface ReviewShot {
  key: ShotKey | EbookShotKey;
  label: string;
  note: string;
  question: string;
}

export type EbookShotKey = "order" | "receipt";

export const SHOTS: ReviewShot[] = [
  {
    key: "front",
    label: "앞면",
    note: "표지 + 닉네임 쪽지",
    question: "룰북·판본이 일치하고 쪽지 닉네임이 신청자와 같은가",
  },
  { key: "back", label: "뒷면", note: "뒤표지", question: "같은 책의 뒤표지인가" },
  {
    key: "side",
    label: "책등",
    note: "책 옆면의 제목",
    question: "실물로 제본된 책이고 제목이 보이는가",
  },
];

export const EBOOK_SHOTS: ReviewShot[] = [
  {
    key: "order",
    label: "구매 내역",
    note: "주문 내역 화면",
    question: "상품명이 신청한 책·판본과 같고, 결제 완료 상태인가",
  },
  {
    key: "receipt",
    label: "영수증",
    note: "이메일 영수증 또는 PDF",
    question: "주문번호가 입력값과 같고, 취소·환불 표시가 없는가",
  },
];
