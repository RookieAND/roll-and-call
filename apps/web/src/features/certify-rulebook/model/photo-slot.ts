export const PHOTO_SLOT = {
  empty: "empty",
  uploading: "uploading",
  done: "done",
  // 재신청에서 이어받은 이전 사진.
  previous: "previous",
  error: "error",
} as const;

export type PhotoSlot =
  | { status: typeof PHOTO_SLOT.empty }
  | { status: typeof PHOTO_SLOT.uploading; progress: number }
  | { status: typeof PHOTO_SLOT.done | typeof PHOTO_SLOT.previous; url: string }
  | { status: typeof PHOTO_SLOT.error; message: string };

export function slotUrl(slot: PhotoSlot) {
  return slot.status === PHOTO_SLOT.done || slot.status === PHOTO_SLOT.previous ? slot.url : "";
}
