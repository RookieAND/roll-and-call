import { hasFinalConsonant } from "./has-final-consonant";

// "하늘달빛과" / "노이와".
export function comitativeParticle(word: string) {
  return hasFinalConsonant(word) ? "과" : "와";
}
