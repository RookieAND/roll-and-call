const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const JONGSEONG_COUNT = 28;

// 한글이 아니면 받침이 없는 쪽으로 둔다("noi_는", "rookieand와").
export function hasFinalConsonant(word: string) {
  const trimmed = word.trimEnd();
  const last = trimmed.codePointAt(trimmed.length - 1);
  if (last === undefined || last < HANGUL_START || last > HANGUL_END) return false;
  return (last - HANGUL_START) % JONGSEONG_COUNT !== 0;
}
