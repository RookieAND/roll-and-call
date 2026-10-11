interface GroupConfirmLabelInput {
  approveCount: number;
  rejectCount: number;
}

// 확정 버튼 글자. 승인과 반려가 섞이면 두 처리가 함께 일어난다는 것을 그대로 적는다.
export function groupConfirmLabel({ approveCount, rejectCount }: GroupConfirmLabelInput) {
  if (rejectCount === 0) return `${approveCount}권 승인`;
  if (approveCount === 0) return `${rejectCount}권 반려`;
  return `승인 ${approveCount}권 · 반려 ${rejectCount}권 확정`;
}
