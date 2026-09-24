import { CERT_PHOTO_ACCEPT, CERT_PHOTO_MAX_BYTES } from "./cert-photo-rules";

export function certPhotoError(file: File): string | null {
  if (!CERT_PHOTO_ACCEPT.split(",").includes(file.type)) return "JPG·PNG 사진만 올릴 수 있습니다.";
  if (file.size > CERT_PHOTO_MAX_BYTES) return "10MB를 넘습니다. 더 작은 사진을 올려 주세요.";
  return null;
}
