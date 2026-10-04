import { CERT_PHOTO_ACCEPT } from "./cert-photo-rules";

// 형식은 고르기 직후 본다. 크기(10MB)는 줄인 뒤의 파일로 uploadCertPhoto가 본다.
export function certPhotoError({ file, accept }: { file: File; accept: string }): string | null {
  if (accept.split(",").includes(file.type)) return null;
  return accept === CERT_PHOTO_ACCEPT
    ? "JPG·PNG 사진만 올릴 수 있습니다."
    : "JPG·PNG 사진이나 PDF만 올릴 수 있습니다.";
}
