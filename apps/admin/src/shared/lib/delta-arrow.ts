export function deltaArrow(delta: number) {
  if (delta > 0) return "▲";
  if (delta < 0) return "▼";
  return "–";
}
