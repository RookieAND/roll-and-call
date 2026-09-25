import { CERT_STATE, type MyRulebook } from "@/entities/rulebook";

// 시트 아래 "더블크로스 3rd · 1권, 2권" 한 줄. 반려된 책 하나면 다시 신청이라고 적는다.
export function selectionSummary(selected: MyRulebook[]) {
  const [first] = selected;
  if (!first) return "";
  const set = `${first.categoryName} ${first.edition}`.trim();
  if (selected.length === 1 && first.state === CERT_STATE.rejected) return `${set} · 다시 신청`;
  return `${set} · ${selected.map((rulebook) => rulebook.shortName).join(", ")}`;
}
