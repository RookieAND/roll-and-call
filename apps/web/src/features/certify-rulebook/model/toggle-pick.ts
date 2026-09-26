import type { MyRulebook } from "@/entities/rulebook";

import { PICKER_ROW, pickerRow } from "./picker-row";

// 한 권을 담거나 뺀다. 기본 룰북을 빼서 기댈 곳이 없어진 서플리먼트는 함께 뺀다.
export function togglePick(selectedIds: string[], rulebookId: string, rulebooks: MyRulebook[]) {
  let next = selectedIds.includes(rulebookId)
    ? selectedIds.filter((id) => id !== rulebookId)
    : [...selectedIds, rulebookId];
  for (;;) {
    const kept = next.filter((id) => {
      const rulebook = rulebooks.find((candidate) => candidate.id === id);
      return rulebook && pickerRow(rulebook, rulebooks, next).type === PICKER_ROW.pick;
    });
    if (kept.length === next.length) return kept;
    next = kept;
  }
}
