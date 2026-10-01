import { SESSION_STATE } from "@/entities/game";

import type { SessionFacts } from "./derive-session-facts";
import { SESSION_CHIP, type SessionChip } from "./session-card-model";

// 사람은 모였고 시간만 남은 구인이 조율 중이다. 추첨을 기다리는 구인은 아직 사람을 고르는 중이라 모집 중에 둔다.
export function hostSessionChip({
  state,
  awaitingTime,
}: {
  state: SessionFacts["state"];
  awaitingTime: boolean;
}): SessionChip {
  if (state === SESSION_STATE.confirmed) return SESSION_CHIP.confirmed;
  if (
    state === SESSION_STATE.scheduling ||
    state === SESSION_STATE.pendingConfirm ||
    awaitingTime
  ) {
    return SESSION_CHIP.scheduling;
  }
  return SESSION_CHIP.recruiting;
}
