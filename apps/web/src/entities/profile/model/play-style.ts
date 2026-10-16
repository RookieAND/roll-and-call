export const PLAY_STYLE_MAX_LENGTH = 600;

// 줄바꿈은 그대로 두고 줄 끝 공백과 앞뒤 빈 줄만 걷는다. 비면 null.
export function normalizePlayStyle(input: string): string | null {
  const text = input
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .trim();
  return text || null;
}
