import {
  endsWithHangulSyllable,
  objectParticle,
} from "@roll-and-call/database/notifications/model";

export function withObjectParticle(word: string) {
  return endsWithHangulSyllable(word) ? `${word}${objectParticle(word)}` : `${word}을(를)`;
}
