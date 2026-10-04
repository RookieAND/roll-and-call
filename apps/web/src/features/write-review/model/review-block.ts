export const REVIEW_BLOCK = {
  writePeriodOver: "write-period-over",
  attendancePending: "attendance-pending",
  alreadyWritten: "already-written",
  absent: "absent",
  editPeriodOver: "edit-period-over",
  unavailable: "unavailable",
  suspended: "suspended",
} as const;

export type ReviewBlock = (typeof REVIEW_BLOCK)[keyof typeof REVIEW_BLOCK];

export const MY_REVIEWS_HREF = "/me/reviews";

export const REVIEW_BLOCK_DIALOG: Record<
  ReviewBlock,
  { title: string; description: string; confirmLabel: string; toMyReviews: boolean }
> = {
  [REVIEW_BLOCK.writePeriodOver]: {
    title: "작성 기간이 지났습니다",
    description: "쓰던 글은 임시 저장되어 있습니다.",
    confirmLabel: "확인",
    toMyReviews: false,
  },
  [REVIEW_BLOCK.attendancePending]: {
    title: "출석을 다시 확인 중입니다",
    description: "확인이 끝나면 다시 제출해 주세요.",
    confirmLabel: "확인",
    toMyReviews: false,
  },
  [REVIEW_BLOCK.alreadyWritten]: {
    title: "이미 쓴 후기가 있습니다",
    description: "다른 기기에서 먼저 등록했습니다.",
    confirmLabel: "내 후기 보기",
    toMyReviews: true,
  },
  [REVIEW_BLOCK.absent]: {
    title: "불참으로 바뀐 세션입니다",
    description: "불참한 세션은 쓸 수 없습니다.",
    confirmLabel: "확인",
    toMyReviews: false,
  },
  [REVIEW_BLOCK.editPeriodOver]: {
    title: "수정 기간이 지났습니다",
    description: "이제 삭제만 할 수 있습니다.",
    confirmLabel: "확인",
    toMyReviews: true,
  },
  [REVIEW_BLOCK.unavailable]: {
    title: "볼 수 없는 후기입니다",
    description: "삭제되었거나 권한이 없습니다.",
    confirmLabel: "확인",
    toMyReviews: false,
  },
  [REVIEW_BLOCK.suspended]: {
    title: "활동 정지 기간입니다",
    description: "정지가 끝나면 후기를 쓸 수 있습니다.",
    confirmLabel: "확인",
    toMyReviews: false,
  },
};
