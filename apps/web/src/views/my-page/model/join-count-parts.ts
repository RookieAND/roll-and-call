export function joinCountParts(parts: [string, number][]): string | null {
  const text = parts
    .filter(([, count]) => count > 0)
    .map(([label, count]) => `${label} ${count}`)
    .join(" · ");
  return text || null;
}
