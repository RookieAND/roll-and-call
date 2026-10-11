import type { BulkDraft } from "./bulk-draft";
import { PHOTO_SLOT } from "./photo-slot";

export function emptyBulkDraft(): BulkDraft {
  return { photos: [{ status: PHOTO_SLOT.empty }] };
}
