import type { MyRulebook } from "@/entities/rulebook";

// 다음 버튼 위 "2권 담음 · 더블크로스 3rd 1권, 2권" 한 줄.
export function selectionSummary(selected: MyRulebook[]) {
  const [first] = selected;
  if (!first) return "담은 책이 없습니다";
  const set = `${first.categoryName} ${first.edition}`.trim();
  const names = selected.map((rulebook) => rulebook.shortName).join(", ");
  return `${selected.length}권 담음 · ${set} ${names}`;
}
