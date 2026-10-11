import type { BulkDraft } from "./bulk-draft";
import { slotKey } from "./photo-slot";

export function bulkPhotoKeys(draft: BulkDraft) {
  return draft.photos.map(slotKey).filter((key) => key !== "");
}
