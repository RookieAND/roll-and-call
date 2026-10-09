export const APPLICATION_NOTE_MAX_LENGTH = 500;

// 앞뒤 공백을 자른 글을 돌려주고, 비었거나 500자를 넘으면 null이다.
export function normalizeApplicationNote(note: string | undefined | null): string | null {
  const trimmed = note?.trim() ?? "";
  if (trimmed.length === 0 || trimmed.length > APPLICATION_NOTE_MAX_LENGTH) return null;
  return trimmed;
}
