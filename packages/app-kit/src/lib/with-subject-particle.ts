import { endsWithHangulSyllable } from "./ends-with-hangul-syllable";
import { subjectParticle } from "./subject-particle";

export function withSubjectParticle(word: string) {
  return endsWithHangulSyllable(word) ? `${word}${subjectParticle(word)}` : `${word}이(가)`;
}
