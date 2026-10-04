export const PHOTO_SLOT = {
  empty: "empty",
  uploading: "uploading",
  done: "done",
  previous: "previous",
  error: "error",
} as const;

// key는 제출에 쓰는 파일 키, previewUrl은 화면에 그리는 주소다(방금 올린 사진은 blob 주소, 이전 사진은 서명 URL, 서명 실패면 빈 문자열).
export type PhotoSlot =
  | { status: typeof PHOTO_SLOT.empty }
  | { status: typeof PHOTO_SLOT.uploading; progress: number }
  | {
      status: typeof PHOTO_SLOT.done | typeof PHOTO_SLOT.previous;
      key: string;
      previewUrl: string;
    }
  | { status: typeof PHOTO_SLOT.error; message: string };

export function slotKey(slot: PhotoSlot) {
  return slot.status === PHOTO_SLOT.done || slot.status === PHOTO_SLOT.previous ? slot.key : "";
}

export function slotPreviewUrl(slot: PhotoSlot) {
  return slot.status === PHOTO_SLOT.done || slot.status === PHOTO_SLOT.previous
    ? slot.previewUrl
    : "";
}

export function revokePreview(slot: PhotoSlot) {
  if (slot.status === PHOTO_SLOT.done) URL.revokeObjectURL(slot.previewUrl);
}
