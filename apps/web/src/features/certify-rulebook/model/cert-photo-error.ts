import { CERT_PHOTO_MAX_BYTES } from "./cert-photo-rules";

export function certPhotoError(file: File, accept: string): string | null {
  if (!accept.split(",").includes(file.type)) {
    return accept.includes("pdf")
      ? "JPG·PNG 사진이나 PDF만 올릴 수 있습니다."
      : "JPG·PNG 사진만 올릴 수 있습니다.";
  }
  if (file.size > CERT_PHOTO_MAX_BYTES) return "10MB를 넘습니다. 더 작은 사진으로 올려 주세요.";
  return null;
}
