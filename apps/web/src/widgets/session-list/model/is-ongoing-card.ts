import { SESSION_CHIP, type SessionCardModel } from "./session-card-model";

// 진행 중은 두 탭 모두 끝나지 않은 세션 전부다(D82). 조율 중·확정·대기 칩과 겹쳐 보여도 된다.
export function isOngoingCard(card: Pick<SessionCardModel, "chip">): boolean {
  return card.chip !== SESSION_CHIP.ended;
}
