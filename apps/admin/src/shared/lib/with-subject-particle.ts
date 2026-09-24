const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;

// 받침이 있으면 "이", 없으면 "가". 한글로 끝나지 않는 닉네임은 소리를 알 수 없어 "이(가)"로 둔다.
export function withSubjectParticle(word: string) {
  const code = word.charCodeAt(word.length - 1);
  if (code < HANGUL_START || code > HANGUL_END) return `${word}이(가)`;
  return (code - HANGUL_START) % 28 === 0 ? `${word}가` : `${word}이`;
}
