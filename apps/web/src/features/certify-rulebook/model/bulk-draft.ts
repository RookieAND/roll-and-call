import type { PhotoSlot } from "./photo-slot";

// 여러 권을 함께 신청할 때 올리는 사진. 첫 장만 있으면 되고, 책이 가려지면 더 올릴 수 있다.
export interface BulkDraft {
  photos: PhotoSlot[];
}
