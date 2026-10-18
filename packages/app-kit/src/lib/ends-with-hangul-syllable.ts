import { HANGUL_END, HANGUL_START } from "./final-consonant-of";

// 마지막 글자(공백 포함)가 한글 음절인가. 한글이 아니면 「을(를)」처럼 두 조사를 다 보여 주는 곳에서 쓴다.
export function endsWithHangulSyllable(word: string) {
  const code = Array.from(word).at(-1)?.codePointAt(0) ?? 0;
  return code >= HANGUL_START && code <= HANGUL_END;
}
