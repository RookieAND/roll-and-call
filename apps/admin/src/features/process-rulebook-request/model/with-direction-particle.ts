const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const RIEUL = 8;

// 받침이 없거나 ㄹ이면 "로", 그 밖의 받침이면 "으로". 한글로 끝나지 않으면 "(으)로".
export function withDirectionParticle(word: string) {
  const code = word.charCodeAt(word.length - 1);
  if (code < HANGUL_START || code > HANGUL_END) return `${word}(으)로`;
  const finalConsonant = (code - HANGUL_START) % 28;
  return finalConsonant === 0 || finalConsonant === RIEUL ? `${word}로` : `${word}으로`;
}
