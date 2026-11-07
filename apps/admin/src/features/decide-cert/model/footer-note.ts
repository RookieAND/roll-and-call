import { CERT_REVIEW_STATE, type CertReviewState } from "./cert-review-state";

interface GroupNoteInput {
  approveCount: number;
  rejectCount: number;
}

interface FooterNoteInput {
  state: CertReviewState;
  checkedCount: number;
  checkableCount: number;
  rejecting?: boolean;
  reasonPicked: boolean;
  userReasonFilled: boolean;
  group?: GroupNoteInput;
}

export const FOOTER_NOTE_TARGET = { photos: "photos", reason: "reason" } as const;
export type FooterNoteTarget = (typeof FOOTER_NOTE_TARGET)[keyof typeof FOOTER_NOTE_TARGET];

// target이 없으면 눌러서 풀 수 있는 이유가 아니라 상태 안내다.
export interface FooterNote {
  text: string;
  target?: FooterNoteTarget;
}

const REASON_NOTE: FooterNote = {
  text: "반려 사유를 골라야 반려할 수 있습니다",
  target: FOOTER_NOTE_TARGET.reason,
};
const USER_REASON_NOTE: FooterNote = {
  text: "사용자에게 보이는 사유를 입력해야 반려할 수 있습니다",
  target: FOOTER_NOTE_TARGET.reason,
};

// 승인이나 반려가 꺼진 이유를 한 줄로 알린다. 우선순위: 이미 처리됨, 기본 룰북 심사 대기, 사진 미확인, 반려 사유 미선택, 보이는 사유 미입력.
export function footerNote({
  state,
  checkedCount,
  checkableCount,
  rejecting = false,
  reasonPicked,
  userReasonFilled,
  group,
}: FooterNoteInput): FooterNote | undefined {
  if (state === CERT_REVIEW_STATE.processed) return { text: "이미 처리된 신청입니다" };
  if (state === CERT_REVIEW_STATE.waiting) {
    return { text: "기본 룰북 심사를 마친 뒤에 심사할 수 있습니다" };
  }
  if (state !== CERT_REVIEW_STATE.open) return undefined;
  const photosPending = checkedCount < checkableCount;
  const photoNote = {
    text: `사진 확인 ${checkedCount}/${checkableCount} · 모두 체크해야 승인할 수 있습니다`,
    target: FOOTER_NOTE_TARGET.photos,
  };
  const reasonNote = reasonPicked ? USER_REASON_NOTE : REASON_NOTE;
  const reasonMissing = !(reasonPicked && userReasonFilled);
  if (group) {
    if (group.approveCount > 0 && photosPending) return photoNote;
    if (group.rejectCount > 0 && reasonMissing) return reasonNote;
    return undefined;
  }
  if (rejecting) return reasonMissing ? reasonNote : undefined;
  return photosPending ? photoNote : undefined;
}
