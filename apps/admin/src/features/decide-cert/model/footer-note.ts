interface GroupNoteInput {
  approveCount: number;
  rejectCount: number;
  reasonReady: boolean;
}

interface FooterNoteInput {
  reviewable: boolean;
  checkedCount: number;
  checkableCount: number;
  group?: GroupNoteInput;
}

export const FOOTER_NOTE_TARGET = { photos: "photos", reason: "reason" } as const;
export type FooterNoteTarget = (typeof FOOTER_NOTE_TARGET)[keyof typeof FOOTER_NOTE_TARGET];

export interface FooterNote {
  text: string;
  target: FooterNoteTarget;
}

// 승인이나 반려가 막힌 이유를 한 줄로 알린다. target은 눌렀을 때 이동할 곳이다.
export function footerNote({
  reviewable,
  checkedCount,
  checkableCount,
  group,
}: FooterNoteInput): FooterNote | undefined {
  if (!reviewable) return undefined;
  const photosPending = checkedCount < checkableCount;
  const photoNote = {
    text: `사진 확인 ${checkedCount}/${checkableCount} · 모두 체크해야 승인할 수 있습니다`,
    target: FOOTER_NOTE_TARGET.photos,
  };
  if (!group) return photosPending ? photoNote : undefined;
  if (group.approveCount > 0 && photosPending) return photoNote;
  if (group.rejectCount > 0 && !group.reasonReady) {
    return { text: "반려 사유를 입력해야 확정할 수 있습니다", target: FOOTER_NOTE_TARGET.reason };
  }
  return undefined;
}
