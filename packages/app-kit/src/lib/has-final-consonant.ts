import { finalConsonantOf, NO_FINAL_CONSONANT } from "./final-consonant-of";

export function hasFinalConsonant(word: string) {
  return finalConsonantOf(word) !== NO_FINAL_CONSONANT;
}
