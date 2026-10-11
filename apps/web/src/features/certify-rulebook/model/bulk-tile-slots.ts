import { BULK_CERT_MAX_PHOTOS } from "@roll-and-call/database/certifications/model";

import type { BulkDraft } from "./bulk-draft";
import { PHOTO_SLOT, slotKey, type PhotoSlot } from "./photo-slot";

// 화면에 그리는 칸. 마지막 칸까지 채웠고 한도에 여유가 있으면 다음 사진을 받을 빈 칸을 하나 더 보인다.
export function bulkTileSlots(draft: BulkDraft): PhotoSlot[] {
  const last = draft.photos.at(-1);
  const canAdd =
    last !== undefined && slotKey(last) !== "" && draft.photos.length < BULK_CERT_MAX_PHOTOS;
  return canAdd ? [...draft.photos, { status: PHOTO_SLOT.empty }] : draft.photos;
}
