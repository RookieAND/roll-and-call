export function percent(part: number, whole: number) {
  return whole ? Math.round((part / whole) * 100) : 0;
}
