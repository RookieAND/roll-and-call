const KILOBYTE = 1024;
const MEGABYTE = KILOBYTE * 1024;

export function formatBytes(size: number): string {
  if (size < MEGABYTE) return `${Math.max(1, Math.round(size / KILOBYTE))}KB`;
  return `${(size / MEGABYTE).toFixed(1)}MB`;
}
