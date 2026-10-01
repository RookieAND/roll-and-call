export const REVIEW_PHOTO_BUCKET = "review-photos";

const PUBLIC_PREFIX = `/storage/v1/object/public/${REVIEW_PHOTO_BUCKET}/`;

export function reviewPhotoPathOf(url: string): string | null {
  const prefixIndex = url.indexOf(PUBLIC_PREFIX);
  if (prefixIndex < 0) return null;
  const path = decodeURIComponent(url.slice(prefixIndex + PUBLIC_PREFIX.length).split("?")[0]!);
  return path || null;
}
