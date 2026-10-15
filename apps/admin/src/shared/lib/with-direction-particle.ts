import {
  directionalParticle,
  endsWithHangulSyllable,
} from "@roll-and-call/database/notifications/model";

// 한글로 끝나지 않으면 「로」.
export function withDirectionParticle(word: string) {
  return endsWithHangulSyllable(word) ? `${word}${directionalParticle(word)}` : `${word}로`;
}
