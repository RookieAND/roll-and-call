import type { BulkDraft } from "./bulk-draft";
import { bulkPhotoKeys } from "./bulk-photo-keys";
import { PHOTO_SLOT } from "./photo-slot";

export function bulkDraftMissing(draft: BulkDraft): string | null {
  const failedIndex = draft.photos.findIndex((slot) => slot.status === PHOTO_SLOT.error);
  if (failedIndex >= 0) return `사진 ${failedIndex + 1}번을 다시 올려야 합니다`;
  if (draft.photos.some((slot) => slot.status === PHOTO_SLOT.uploading)) {
    return "사진을 올리는 중입니다";
  }
  if (bulkPhotoKeys(draft).length === 0) return "사진을 한 장 이상 올려야 합니다";
  return null;
}
