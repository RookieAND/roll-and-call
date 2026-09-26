import { CERT_FORMAT, type CertFormat, type CertShot } from "@/entities/rulebook";

import type { BookDraft } from "./book-draft";
import { OTHER_SELLER } from "./other-seller";
import { slotUrl } from "./photo-slot";

// 서버로 보내는 책 한 권의 신청. 실물은 사진 세 장, 전자책은 구매 내역·영수증과 주문 정보만 채운다.
export interface CertEntry {
  rulebookId: string;
  format: CertFormat;
  photos: Record<CertShot, string>;
  seller: string;
  captureUrl: string;
  receiptUrl: string;
  orderNumber: string;
  orderDate: string;
}

export function toCertEntry({ rulebookId, draft }: { rulebookId: string; draft: BookDraft }) {
  const ebook = draft.format === CERT_FORMAT.ebook;
  const entry: CertEntry = {
    rulebookId,
    format: draft.format,
    photos: {
      front: ebook ? "" : slotUrl(draft.shots.front),
      back: ebook ? "" : slotUrl(draft.shots.back),
      side: ebook ? "" : slotUrl(draft.shots.side),
    },
    seller: ebook ? (draft.seller === OTHER_SELLER ? draft.sellerOther.trim() : draft.seller) : "",
    captureUrl: ebook ? slotUrl(draft.proofs.order) : "",
    receiptUrl: ebook ? slotUrl(draft.proofs.receipt) : "",
    orderNumber: ebook ? draft.orderNumber.trim() : "",
    orderDate: ebook ? draft.orderDate.trim() : "",
  };
  return entry;
}
