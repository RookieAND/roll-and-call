import { directionalParticle } from "./directional-particle";
import { endsWithHangulSyllable } from "./ends-with-hangul-syllable";

// 한글로 끝나지 않으면 「로」.
export function withDirectionParticle(word: string) {
  return endsWithHangulSyllable(word) ? `${word}${directionalParticle(word)}` : `${word}로`;
}
