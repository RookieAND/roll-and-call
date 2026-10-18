import { hasFinalConsonant } from "./has-final-consonant";

export function objectParticle(word: string) {
  return hasFinalConsonant(word) ? "을" : "를";
}
