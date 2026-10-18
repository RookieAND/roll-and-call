import { endsWithHangulSyllable } from "./ends-with-hangul-syllable";
import { objectParticle } from "./object-particle";

export function withObjectParticle(word: string) {
  return endsWithHangulSyllable(word) ? `${word}${objectParticle(word)}` : `${word}을(를)`;
}
