const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;

// 받침이 있으면 "은", 없으면 "는". 한글로 끝나지 않으면 "은(는)".
export function withTopicParticle(word: string) {
  const code = word.charCodeAt(word.length - 1);
  if (code < HANGUL_START || code > HANGUL_END) return `${word}은(는)`;
  return (code - HANGUL_START) % 28 === 0 ? `${word}는` : `${word}은`;
}
