const HANGUL_START = 0xac00;
const HANGUL_END = 0xd7a3;
const RIEUL = 8;

// ‘닉네임’ 뒤에 방향 조사를 붙인다. 받침이 없거나 ㄹ이면 '로', 그 밖의 받침이면 '으로'. 한글이 아니면 '로'.
export function quoteWithDirection(word: string) {
  const code = word.charCodeAt(word.length - 1);
  const final = code >= HANGUL_START && code <= HANGUL_END ? (code - HANGUL_START) % 28 : 0;
  const particle = final === 0 || final === RIEUL ? "로" : "으로";
  return `‘${word}’${particle}`;
}
