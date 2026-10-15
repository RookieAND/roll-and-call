import {
  comitativeParticle,
  endsWithHangulSyllable,
} from "@roll-and-call/database/notifications/model";

// 한글로 끝나지 않으면 "와(과)".
export function withAndParticle(word: string) {
  return endsWithHangulSyllable(word) ? `${word}${comitativeParticle(word)}` : `${word}와(과)`;
}
