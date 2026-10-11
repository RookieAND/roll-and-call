interface GroupNoteInput {
  approveCount: number;
  rejectCount: number;
  reasonReady: boolean;
}

interface FooterNoteInput {
  reviewable: boolean;
  allChecked: boolean;
  group?: GroupNoteInput;
}

// 승인이나 반려가 막힌 이유를 한 줄로 알린다.
export function footerNote({ reviewable, allChecked, group }: FooterNoteInput) {
  if (!reviewable) return undefined;
  if (!group) return allChecked ? undefined : "모든 확인 항목을 체크해야 승인할 수 있습니다";
  if (group.approveCount > 0 && !allChecked) {
    return "승인하려면 모든 확인 항목을 체크해야 합니다";
  }
  if (group.rejectCount > 0 && !group.reasonReady) return "반려 사유를 입력해야 확정할 수 있습니다";
  return undefined;
}
