import type { RosterSummary } from "./roster-summary";

// 세션 시작 뒤 정원이 찼을 때 확정 목록 아래 안내(D255).
export function confirmedHintLines({
  started,
  isFull,
  capacityRaised,
}: Pick<RosterSummary, "started" | "isFull" | "capacityRaised">): string[] {
  if (!started || !isFull) return [];
  if (capacityRaised) return ["이미 정원을 한 번 늘렸습니다.", "불참으로 내보내면 자리가 납니다."];
  return ["노쇼라면 먼저 불참으로 내보내면 자리가 납니다."];
}
