// 끝난 세션 확정 참여자의 후기 상태. 작성 가능이면 [후기 쓰기], 그 밖은 [후기 보기].
export const REVIEW_STATUS = {
  writable: "writable",
  written: "written",
  unavailable: "unavailable",
} as const;
export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS];
