import type { BulkDraft } from "./bulk-draft";
import type { PhotoSlot } from "./photo-slot";

interface SetBulkPhotoInput {
  draft: BulkDraft;
  index: number;
  slot: PhotoSlot;
}

// 목록 끝 다음 번호를 주면 새 칸으로 덧붙는다.
export function setBulkPhoto({ draft, index, slot }: SetBulkPhotoInput): BulkDraft {
  const photos = [...draft.photos];
  photos[index] = slot;
  return { photos };
}
