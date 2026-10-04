export const CERT_PHOTO_BUCKET = "cert-photos";

// 버킷은 비공개지만 DB에는 공개 URL 모양 문자열을 "파일 키"로 저장한다.
// 하루 정리 함수 orphan_storage_objects(0041)가 이 모양으로 연결 여부를 판단하므로, 경로로 바꾸면 모든 인증 사진이 지워진다.
// 화면에는 이 키를 그리지 않고 signCertPhotoUrls의 서명 URL만 그린다.
const PUBLIC_PREFIX = `/storage/v1/object/public/${CERT_PHOTO_BUCKET}/`;

export function certPhotoPathOf(url: string): string | null {
  const prefixIndex = url.indexOf(PUBLIC_PREFIX);
  if (prefixIndex < 0) return null;
  const path = decodeURIComponent(url.slice(prefixIndex + PUBLIC_PREFIX.length).split("?")[0]!);
  return path || null;
}
