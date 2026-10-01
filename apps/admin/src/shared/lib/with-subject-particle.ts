const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;

export function withSubjectParticle(word: string) {
  const code = word.charCodeAt(word.length - 1);
  if (code < HANGUL_START || code > HANGUL_END) return `${word}이(가)`;
  return (code - HANGUL_START) % 28 === 0 ? `${word}가` : `${word}이`;
}
