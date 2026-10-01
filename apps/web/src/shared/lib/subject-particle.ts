import { hasFinalConsonant } from "./has-final-consonant";

export function subjectParticle(word: string) {
  return hasFinalConsonant(word) ? "이" : "가";
}
