import type { CertFormat, CertProof, CertShot } from "@/entities/rulebook";

import type { PhotoSlot } from "./photo-slot";
import type { PurchaseRecord } from "./purchase-record";

// 책 한 권의 신청 내용. 실물이면 사진 세 칸과 선택인 구매 기록, 전자책이면 구매 내역·영수증 두 칸과 판매처·주문 정보.
export interface BookDraft {
  format: CertFormat;
  shots: Record<CertShot, PhotoSlot>;
  proofs: Record<CertProof, PhotoSlot>;
  purchase: PurchaseRecord;
  // 목록의 판매처 이름, 목록에 없으면 OTHER_SELLER와 직접 적은 이름.
  seller: string;
  sellerOther: string;
}
