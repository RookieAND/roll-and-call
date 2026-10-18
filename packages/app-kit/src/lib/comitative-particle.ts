import { hasFinalConsonant } from "./has-final-consonant";

export function comitativeParticle(word: string) {
  return hasFinalConsonant(word) ? "과" : "와";
}
