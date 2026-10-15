import { endsWithHangulSyllable, topicParticle } from "@roll-and-call/database/notifications/model";

export function withTopicParticle(word: string) {
  return endsWithHangulSyllable(word) ? `${word}${topicParticle(word)}` : `${word}은(는)`;
}
