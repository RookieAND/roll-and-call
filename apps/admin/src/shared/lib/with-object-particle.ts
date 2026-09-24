const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;

// 받침이 있으면 "을", 없으면 "를". 한글로 끝나지 않으면 "을(를)".
export function withObjectParticle(word: string) {
  const code = word.charCodeAt(word.length - 1);
  if (code < HANGUL_START || code > HANGUL_END) return `${word}을(를)`;
  return (code - HANGUL_START) % 28 === 0 ? `${word}를` : `${word}을`;
}
