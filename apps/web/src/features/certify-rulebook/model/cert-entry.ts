import { CERT_FORMAT, type CertFormat, type CertShot } from "@/entities/rulebook";

import type { BookDraft } from "./book-draft";
import { slotKey } from "./photo-slot";
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
      front: ebook ? "" : slotKey(draft.shots.front),
      back: ebook ? "" : slotKey(draft.shots.back),
      side: ebook ? "" : slotKey(draft.shots.side),
    },
    seller: ebook ? sellerName(draft) : "",
    captureUrl: ebook ? slotKey(draft.proofs.order) : "",
    receiptUrl: ebook ? slotKey(draft.proofs.receipt) : "",
    orderNumber: ebook ? draft.orderNumber.trim() : "",
    orderDate: ebook ? draft.orderDate.trim() : "",
  };
  return entry;
}
