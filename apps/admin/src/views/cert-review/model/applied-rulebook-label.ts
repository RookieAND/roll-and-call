// 묶음 신청이면 「첫 책 외 N권」, 한 권이면 책 이름 그대로.
interface AppliedRulebookLabelInput {
  rulebook: string;
  groupBookCount: number;
}

export function appliedRulebookLabel({ rulebook, groupBookCount }: AppliedRulebookLabelInput) {
  if (groupBookCount <= 1) return rulebook;
  return `${rulebook} 외 ${groupBookCount - 1}권`;
}
