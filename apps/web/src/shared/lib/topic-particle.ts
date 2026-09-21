import { hasFinalConsonant } from "./has-final-consonant";

// "한랑아는" / "루킨은".
export function topicParticle(word: string) {
  return hasFinalConsonant(word) ? "은" : "는";
}
