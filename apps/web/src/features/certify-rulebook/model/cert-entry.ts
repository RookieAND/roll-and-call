import { CERT_FORMAT, type CertFormat, type CertShot } from "@/entities/rulebook";

import type { BookDraft } from "./book-draft";
import { slotUrl } from "./photo-slot";
import { sellerName } from "./seller-name";

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
    seller: ebook ? sellerName(draft) : "",
    captureUrl: ebook ? slotUrl(draft.proofs.order) : "",
    receiptUrl: ebook ? slotUrl(draft.proofs.receipt) : "",
    orderNumber: ebook ? draft.orderNumber.trim() : "",
    orderDate: ebook ? draft.orderDate.trim() : "",
  };
  return entry;
}
