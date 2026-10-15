// 모바일 목록 줄은 폭이 좁아 「2026년 9월 17일 01:42」에서 연도를 뗀다.
export function withoutYear(text: string) {
  return text.replace(/^\d+년 /, "");
}
