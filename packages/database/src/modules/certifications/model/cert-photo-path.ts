export const CERT_PHOTO_BUCKET = "cert-photos";

// 버킷은 비공개지만 DB에는 공개 URL 모양 문자열을 "파일 키"로 저장한다.
// 하루 정리 함수 orphan_storage_objects(0041)와 RLS(0054)가 이 모양에 기대므로, 경로로 바꾸면 모든 인증 사진이 지워진다.
// 화면에는 이 키를 그리지 않고 서명 URL만 그린다. 모양이 다르면 null.
const PUBLIC_PREFIX = `/storage/v1/object/public/${CERT_PHOTO_BUCKET}/`;

export function certPhotoPathOf(url: string): string | null {
  const prefixIndex = url.indexOf(PUBLIC_PREFIX);
  if (prefixIndex < 0) return null;
  return decodeURIComponent(url.slice(prefixIndex + PUBLIC_PREFIX.length).split("?")[0]!) || null;
}
