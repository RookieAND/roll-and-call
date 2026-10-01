import type { CertFormat, CertProof, CertShot } from "@/entities/rulebook";

import type { PhotoSlot } from "./photo-slot";

export interface BookDraft {
  format: CertFormat;
  shots: Record<CertShot, PhotoSlot>;
  proofs: Record<CertProof, PhotoSlot>;
  // 목록의 판매처 이름, 목록에 없으면 OTHER_SELLER와 직접 적은 이름.
  seller: string;
  sellerOther: string;
  orderNumber: string;
  orderDate: string;
}
