export function heatLevel(count: number, max: number) {
  return count && max ? Math.ceil((count / max) * 5) : 0;
}
