import { isOngoingCard } from "./is-ongoing-card";
import { SESSION_CHIP, type SessionCardModel } from "./session-card-model";
import { ONGOING_CHIP, type SessionChipKey } from "./session-tabs";

// 조율 중 칩은 따로 두지 않고 확정 칩에 함께 보인다. 일정을 정하는 중인 확정 참여 세션이다.
export function isInSessionChip({
  card,
  chip,
}: {
  card: Pick<SessionCardModel, "chip">;
  chip: SessionChipKey;
}): boolean {
  if (chip === ONGOING_CHIP) return isOngoingCard(card);
  if (chip === SESSION_CHIP.confirmed) {
    return card.chip === SESSION_CHIP.confirmed || card.chip === SESSION_CHIP.scheduling;
  }
  return card.chip === chip;
}
