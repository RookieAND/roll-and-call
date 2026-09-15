export function joinParts(...parts: (string | null | false)[]): string {
  return parts.filter(Boolean).join(" · ");
}
