interface FooterNoteInput {
  reviewable: boolean;
  allChecked: boolean;
  groupMode: boolean;
  approveBookCount: number;
}

// 승인이나 반려가 막힌 이유를 한 줄로 알린다.
export function footerNote({
  reviewable,
  allChecked,
  groupMode,
  approveBookCount,
}: FooterNoteInput) {
  if (!reviewable) return undefined;
  if (!allChecked) return "모든 확인 항목을 체크해야 승인할 수 있습니다";
  if (!groupMode) return undefined;
  if (approveBookCount === 0) return "승인할 책을 체크해 주세요";
  return undefined;
}
