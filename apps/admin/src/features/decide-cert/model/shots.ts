import type { PhotoKey, ShotKey } from "@/shared/server";

export type ReviewShotKey = PhotoKey | EbookShotKey;

export interface ReviewShot<Key extends ReviewShotKey = ReviewShotKey> {
  key: Key;
  label: string;
  note: string;
  question: string;
}

export type EbookShotKey = "order" | "receipt";

export const SHOTS = [
  {
    key: "front",
    label: "앞면",
    note: "표지 + 닉네임 쪽지",
    question: "룰북·판본과 쪽지 닉네임이 맞는가",
  },
  { key: "back", label: "뒷면", note: "뒤표지", question: "같은 책의 뒤표지인가" },
] as const satisfies readonly ReviewShot<ShotKey>[];

export const EBOOK_SHOTS = [
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
] as const satisfies readonly ReviewShot<EbookShotKey>[];

// 여러 권을 함께 신청한 사진은 앞면·뒷면이 아니라 올린 순서대로 부르고, 올리지 않은 칸은 보이지 않는다.
export const GROUP_SHOT_KEYS = [
  "front",
  "back",
  "extra1",
  "extra2",
  "extra3",
] as const satisfies readonly PhotoKey[];
