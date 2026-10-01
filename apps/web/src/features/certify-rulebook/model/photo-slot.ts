export const PHOTO_SLOT = {
  empty: "empty",
  uploading: "uploading",
  done: "done",
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
