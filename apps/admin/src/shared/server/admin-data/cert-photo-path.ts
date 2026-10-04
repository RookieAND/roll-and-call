const PUBLIC_PREFIX = "/storage/v1/object/public/cert-photos/";

// 저장된 공개 URL 모양 문자열에서 버킷 안 경로를 꺼낸다(W13과 같은 규칙). 모양이 다르면 null.
export function certPhotoPath(url: string) {
  const index = url.indexOf(PUBLIC_PREFIX);
  if (index === -1) return null;
  return url.slice(index + PUBLIC_PREFIX.length) || null;
}
