import {
  CERT_FORMAT,
  CERT_PROOF_LABEL,
  CERT_PROOFS,
  CERT_SHOT_LABEL,
  CERT_SHOTS,
} from "@/entities/rulebook";

import type { BookDraft } from "./book-draft";
import { PHOTO_SLOT, slotUrl, type PhotoSlot } from "./photo-slot";
import { OTHER_SELLER } from "./purchase-record";

// 책 한 권에서 아직 채우지 않은 것 한 줄. 다 채웠으면 null.
export function draftMissing(draft: BookDraft): string | null {
  const ebook = draft.format === CERT_FORMAT.ebook;
  const slots: [string, PhotoSlot][] = ebook
    ? CERT_PROOFS.map((proof) => [CERT_PROOF_LABEL[proof], draft.proofs[proof]])
    : CERT_SHOTS.map((shot) => [CERT_SHOT_LABEL[shot], draft.shots[shot]]);
  const failed = slots.find(([, slot]) => slot.status === PHOTO_SLOT.error);
  if (failed) return `${failed[0]} 사진을 다시 올려 주세요`;
  if (slots.some(([, slot]) => slot.status === PHOTO_SLOT.uploading))
    return "사진을 올리는 중입니다";
  const empty = slots.filter(([, slot]) => !slotUrl(slot)).map(([label]) => label);
  if (empty.length > 0) {
    return empty.length === slots.length
      ? `사진 ${slots.length}장을 올려 주세요`
      : `${empty.join("·")} 사진을 올려 주세요`;
  }
  if (!ebook) return null;
  const seller = draft.seller === OTHER_SELLER ? draft.sellerOther.trim() : draft.seller;
  if (!seller) return "판매처를 골라 주세요";
  if (!draft.purchase.orderNumber.trim()) return "주문번호를 적어 주세요";
  return null;
}
