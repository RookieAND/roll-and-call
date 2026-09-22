export const SLOT_SPIN_MS = 3000;

export interface SlotSpin {
  durationMs: number;
  // 주어지면 이 브라우저에서 처음 볼 때만 돈다. 두 번째 방문부터는 값이 처음부터 적혀 있다.
  onceKey?: string;
}
