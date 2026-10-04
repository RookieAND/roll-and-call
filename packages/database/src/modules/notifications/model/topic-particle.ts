import { hasFinalConsonant } from "./has-final-consonant";

export function topicParticle(word: string) {
  return hasFinalConsonant(word) ? "은" : "는";
}
