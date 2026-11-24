import { isNull } from "es-toolkit";

import { SESSION_CHIP, type SessionCardModel } from "@/widgets/session-list";

// 시작 전(일정 미정 포함)이고 끝나거나 취소되지 않은 카드. 진행 중·끝남·취소는 진행·완료로 간다.
export function isUpcomingCard({ card, now }: { card: SessionCardModel; now: Date }): boolean {
  if (card.cancelled || card.chip === SESSION_CHIP.ended) return false;
  return isNull(card.startsAt) || new Date(card.startsAt).getTime() > now.getTime();
}
