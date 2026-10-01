export const REVIEW_STATE = {
  editable: "editable",
  locked: "locked",
  // 작성자가 불참으로 바뀌어 공개를 멈춘 후기. 삭제만 할 수 있다.
  held: "held",
  hidden: "hidden",
  removed: "removed",
} as const;

export type ReviewState = (typeof REVIEW_STATE)[keyof typeof REVIEW_STATE];
