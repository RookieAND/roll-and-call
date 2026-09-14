// 게임 썸네일·진행 이미지를 담는 공개 버킷. 업로드(클라이언트)와 정리(서버)가 같은 이름을 본다.
export const GAME_IMAGE_BUCKET = "game-thumbnails";

const PUBLIC_PREFIX = `/storage/v1/object/public/${GAME_IMAGE_BUCKET}/`;

// 공개 URL → 버킷 안 경로("<uid>/<uuid>.png"). 이 버킷 URL이 아니면 null(외부 URL은 지우지 않는다).
export function gameImagePathOf(url: string): string | null {
  const i = url.indexOf(PUBLIC_PREFIX);
  if (i < 0) return null;
  const path = decodeURIComponent(url.slice(i + PUBLIC_PREFIX.length).split("?")[0]!);
  return path || null;
}
