import { endsWithHangulSyllable } from "./ends-with-hangul-syllable";
import { topicParticle } from "./topic-particle";

export function withTopicParticle(word: string) {
  return endsWithHangulSyllable(word) ? `${word}${topicParticle(word)}` : `${word}은(는)`;
}
