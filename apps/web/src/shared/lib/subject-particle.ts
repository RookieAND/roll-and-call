import { hasFinalConsonant } from "./has-final-consonant";

// "스프롤이" / "인세인이" / "아곤이" / "너냐?!가".
export function subjectParticle(word: string) {
  return hasFinalConsonant(word) ? "이" : "가";
}
