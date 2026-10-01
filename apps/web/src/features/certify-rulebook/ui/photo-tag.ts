import { PHOTO_SLOT, type PhotoSlot } from "../model/photo-slot";

export function photoTag({ status, pdf }: { status: PhotoSlot["status"]; pdf: boolean }) {
  if (status === PHOTO_SLOT.empty) return "예시";
  if (status === PHOTO_SLOT.previous) return "이전 사진";
  if (pdf) return "PDF";
  return null;
}
