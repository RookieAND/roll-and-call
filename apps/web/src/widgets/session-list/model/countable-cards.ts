import type { SessionCardModel } from "./session-card-model";

// 취소된 구인 카드는 목록에는 남기고 탭·칩 숫자에서는 뺀다(D286). 내 세션과 타인 세션 기록(W08)이 같이 쓴다.
export function countableCards<Card extends Pick<SessionCardModel, "cancelled">>(
  cards: readonly Card[],
): Card[] {
  return cards.filter((card) => !card.cancelled);
}
