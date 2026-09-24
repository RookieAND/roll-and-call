export const CERT_PHOTO_BUCKET = "cert-photos";

const PUBLIC_PREFIX = `/storage/v1/object/public/${CERT_PHOTO_BUCKET}/`;

// 인증 사진 버킷의 공개 URL에서 저장 경로("유저id/파일")를 꺼낸다. 이 버킷이 아니면 null.
export function certPhotoPathOf(url: string): string | null {
  const prefixIndex = url.indexOf(PUBLIC_PREFIX);
  if (prefixIndex < 0) return null;
  const path = decodeURIComponent(url.slice(prefixIndex + PUBLIC_PREFIX.length).split("?")[0]!);
  return path || null;
}
