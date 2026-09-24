export const PHOTO_SLOT = {
  empty: "empty",
  uploading: "uploading",
  done: "done",
  error: "error",
} as const;

export type PhotoSlot =
  | { status: typeof PHOTO_SLOT.empty }
  | { status: typeof PHOTO_SLOT.uploading; progress: number }
  | { status: typeof PHOTO_SLOT.done; url: string }
  | { status: typeof PHOTO_SLOT.error; message: string };
