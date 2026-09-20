const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const JONGSEONG_COUNT = 28;

// "한랑아는" / "루킨은". 한글이 아니면 시안을 따라 "는"으로 둔다("noi_는").
export function topicParticle(word: string) {
  const trimmed = word.trimEnd();
  const last = trimmed.codePointAt(trimmed.length - 1);
  if (last === undefined || last < HANGUL_START || last > HANGUL_END) return "는";
  return (last - HANGUL_START) % JONGSEONG_COUNT === 0 ? "는" : "은";
}
