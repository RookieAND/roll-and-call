// 「」로 감싸도 조사는 안쪽 낱말의 받침을 따른다.
export function quoteWithParticle(word: string, withParticle: (word: string) => string) {
  return `「${word}」${withParticle(word).slice(word.length)}`;
}
