import { isUndefined } from "es-toolkit";

const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const JONGSEONG_COUNT = 28;

export const NO_FINAL_CONSONANT = 0;
export const RIEUL_FINAL_CONSONANT = 8;

// 숫자는 읽는 소리의 받침(영 일 이 삼 사 오 육 칠 팔 구). 0이면 받침 없음.
const DIGIT_FINAL_CONSONANTS = [21, 8, 0, 16, 0, 0, 1, 8, 8, 0] as const;

// 마지막 글자의 종성 번호. 한글·숫자가 아니면 받침이 없는 쪽으로 둔다("noi_는", "rookieand와").
export function finalConsonantOf(word: string) {
  const last = Array.from(word.trimEnd()).at(-1);
  if (isUndefined(last)) return NO_FINAL_CONSONANT;
  if (/^[0-9]$/.test(last)) return DIGIT_FINAL_CONSONANTS[Number(last)];
  const code = last.codePointAt(0) ?? 0;
  if (code < HANGUL_START || code > HANGUL_END) return NO_FINAL_CONSONANT;
  return (code - HANGUL_START) % JONGSEONG_COUNT;
}
