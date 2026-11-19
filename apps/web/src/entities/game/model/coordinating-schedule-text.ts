import { roundTotalLabel } from "./round-total-label";

// 「일정 조율 · 총 6회」
export function coordinatingScheduleText(roundCount: number) {
  return `일정 조율 · ${roundTotalLabel(roundCount)}`;
}
