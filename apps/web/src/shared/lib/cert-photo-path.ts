export const CERT_PHOTO_BUCKET = "cert-photos";

const PUBLIC_PREFIX = `/storage/v1/object/public/${CERT_PHOTO_BUCKET}/`;

export function certPhotoPathOf(url: string): string | null {
  const prefixIndex = url.indexOf(PUBLIC_PREFIX);
  if (prefixIndex < 0) return null;
  const path = decodeURIComponent(url.slice(prefixIndex + PUBLIC_PREFIX.length).split("?")[0]!);
  return path || null;
}
