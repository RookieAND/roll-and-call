import type { RosterSummary } from "./roster-summary";

// 정원이 찼을 때 대기 목록 아래 안내(D256).
export function waitingHintLines({
  started,
  isFull,
  beforeDraw,
}: Pick<RosterSummary, "started" | "isFull" | "beforeDraw">): string[] {
  if (!isFull) return [];
  if (started) return ["불참으로 내보내면 자리가 납니다."];
  if (beforeDraw) return [];
  return [
    "정원이 차 있어 바로 확정할 수 없습니다.",
    "확정에서 한 명을 대기로 옮기면 자리가 납니다.",
  ];
}
