import {
  endsWithHangulSyllable,
  subjectParticle,
} from "@roll-and-call/database/notifications/model";

export function withSubjectParticle(word: string) {
  return endsWithHangulSyllable(word) ? `${word}${subjectParticle(word)}` : `${word}이(가)`;
}
