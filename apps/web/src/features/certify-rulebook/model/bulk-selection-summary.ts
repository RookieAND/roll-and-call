import type { MyRulebook } from "@/entities/rulebook";

interface BulkSelectionSummaryInput {
  rulebooks: readonly MyRulebook[];
  selectedIds: readonly string[];
}

// 룰이 달라도 한 묶음으로 신청된다는 것이 보이도록, 고른 책을 룰별 권수로 묶어 한 줄로 만든다.
export function bulkSelectionSummary({ rulebooks, selectedIds }: BulkSelectionSummaryInput) {
  const counts = new Map<string, number>();
  for (const id of selectedIds) {
    const rulebook = rulebooks.find((candidate) => candidate.id === id);
    if (rulebook) counts.set(rulebook.categoryName, (counts.get(rulebook.categoryName) ?? 0) + 1);
  }
  return [...counts].map(([name, count]) => `${name} ${count}권`).join(" · ");
}
