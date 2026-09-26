import { CERT_OPTION, certOption, type MyRulebook } from "@/entities/rulebook";

export const PICKER_ROW = {
  pick: "pick",
  certified: "certified",
  pending: "pending",
  // 고를 수 없는 줄: 무료 배포·신판 인증으로 열림·기본 룰북이 먼저 필요함.
  locked: "locked",
} as const;

export type PickerRowType = (typeof PICKER_ROW)[keyof typeof PICKER_ROW];

// 책 한 줄을 고를 수 있는지와 그 아래 한 줄. 서플리먼트는 같은 판본 기본 룰북을 함께 담으면 풀린다.
export function pickerRow(
  rulebook: MyRulebook,
  rulebooks: MyRulebook[],
  selectedIds: string[],
): { type: PickerRowType; note: string } {
  const option = certOption(rulebook, rulebooks);
  switch (option.type) {
    case CERT_OPTION.pick:
      return { type: PICKER_ROW.pick, note: option.note };
    case CERT_OPTION.certified:
      return { type: PICKER_ROW.certified, note: option.note };
    case CERT_OPTION.pending:
      return { type: PICKER_ROW.pending, note: option.note };
    case CERT_OPTION.needsCore:
      return option.missing.every((core) => selectedIds.includes(core.id))
        ? { type: PICKER_ROW.pick, note: "기본 룰북 결과가 나온 뒤에 확인합니다" }
        : { type: PICKER_ROW.locked, note: option.note };
    default:
      return { type: PICKER_ROW.locked, note: option.note };
  }
}
