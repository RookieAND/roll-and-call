export const GAME_IMAGE_BUCKET = "game-thumbnails";

const PUBLIC_PREFIX = `/storage/v1/object/public/${GAME_IMAGE_BUCKET}/`;

// 이 버킷 URL이 아니면 null: 외부 URL은 지우지 않는다.
export function gameImagePathOf(url: string): string | null {
  const prefixIndex = url.indexOf(PUBLIC_PREFIX);
  if (prefixIndex < 0) return null;
  const path = decodeURIComponent(url.slice(prefixIndex + PUBLIC_PREFIX.length).split("?")[0]!);
  return path || null;
}
