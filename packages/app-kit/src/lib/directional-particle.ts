import { finalConsonantOf, NO_FINAL_CONSONANT, RIEUL_FINAL_CONSONANT } from "./final-consonant-of";

// 받침이 없거나 ㄹ이면 「로」("별7로"), 그 밖은 「으로」.
export function directionalParticle(word: string) {
  const final = finalConsonantOf(word);
  return final === NO_FINAL_CONSONANT || final === RIEUL_FINAL_CONSONANT ? "로" : "으로";
}
