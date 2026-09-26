import { CERT_FORMAT, type CertFormat, type CertShot } from "@/entities/rulebook";

import type { BookDraft } from "./book-draft";
import { slotUrl } from "./photo-slot";
import { OTHER_SELLER } from "./purchase-record";

// 서버로 보내는 책 한 권의 신청.
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

export function toCertEntry(rulebookId: string, draft: BookDraft): CertEntry {
  const ebook = draft.format === CERT_FORMAT.ebook;
  return {
    rulebookId,
    format: draft.format,
    photos: {
      front: ebook ? "" : slotUrl(draft.shots.front),
      back: ebook ? "" : slotUrl(draft.shots.back),
      side: ebook ? "" : slotUrl(draft.shots.side),
    },
    seller: ebook ? (draft.seller === OTHER_SELLER ? draft.sellerOther.trim() : draft.seller) : "",
    captureUrl: ebook ? slotUrl(draft.proofs.order) : draft.purchase.captureUrl,
    receiptUrl: ebook ? slotUrl(draft.proofs.receipt) : "",
    orderNumber: draft.purchase.orderNumber.trim(),
    orderDate: draft.purchase.orderDate.trim(),
  };
}
