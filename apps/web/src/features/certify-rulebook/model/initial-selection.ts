import { CERT_OPTION, certOption, type MyRulebook } from "@/entities/rulebook";

import { toggleSelection } from "./toggle-selection";

// 주소로 넘어온 책 중 지금 고를 수 있는 것만, 시트에서 차례로 누른 것처럼 고른다.
export function initialSelection(rulebooks: MyRulebook[], rulebookIds: string[]) {
  return rulebookIds
    .map((id) => rulebooks.find((rulebook) => rulebook.id === id))
    .filter(
      (rulebook): rulebook is MyRulebook =>
        rulebook !== undefined && certOption(rulebook, rulebooks).type === CERT_OPTION.pick,
    )
    .reduce<MyRulebook[]>(toggleSelection, [])
    .map((rulebook) => rulebook.id);
}
