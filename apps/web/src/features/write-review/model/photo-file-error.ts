import { PHOTO_ACCEPT, PHOTO_MAX_BYTES } from "./photo-rules";

export function photoFileError(file: File): string | null {
  if (!PHOTO_ACCEPT.split(",").includes(file.type)) return "JPG·PNG·WebP 사진만 올릴 수 있습니다.";
  if (file.size > PHOTO_MAX_BYTES) return "5MB를 넘는 사진은 올릴 수 없습니다.";
  return null;
}
