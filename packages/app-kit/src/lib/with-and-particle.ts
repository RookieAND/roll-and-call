import { comitativeParticle } from "./comitative-particle";
import { endsWithHangulSyllable } from "./ends-with-hangul-syllable";

// 한글로 끝나지 않으면 "와(과)".
export function withAndParticle(word: string) {
  return endsWithHangulSyllable(word) ? `${word}${comitativeParticle(word)}` : `${word}와(과)`;
}
