import type { BulkDraft } from "./bulk-draft";
import { PHOTO_SLOT } from "./photo-slot";

interface RemoveBulkPhotoInput {
  draft: BulkDraft;
  index: number;
}

// 가운데 사진을 지우면 뒤 사진이 앞으로 당겨진다. 마지막 한 칸은 비워 둔 채 남긴다.
export function removeBulkPhoto({ draft, index }: RemoveBulkPhotoInput): BulkDraft {
  const photos = draft.photos.filter((_, position) => position !== index);
  return { photos: photos.length > 0 ? photos : [{ status: PHOTO_SLOT.empty }] };
}
