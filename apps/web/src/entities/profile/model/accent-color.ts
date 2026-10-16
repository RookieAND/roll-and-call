const ACCENT_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export const ACCENT_COLOR_ERROR = "강조색은 #RRGGBB 형식으로 입력해 주세요.";

// 비우면 강조색 없음(null). 형식이 맞지 않으면 undefined.
export function normalizeAccentColor(input: string): string | null | undefined {
  const text = input.trim();
  if (!text) return null;
  return ACCENT_COLOR_PATTERN.test(text) ? text.toUpperCase() : undefined;
}
