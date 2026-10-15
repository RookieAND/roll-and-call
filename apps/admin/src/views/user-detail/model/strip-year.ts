// 모바일 줄은 폭이 좁아 「2026년 」을 뺀다.
export function stripYear(text: string) {
  return text.replace(/^\d{4}년 /, "");
}
