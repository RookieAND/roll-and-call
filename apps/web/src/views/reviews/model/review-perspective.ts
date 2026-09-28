// 같은 후기 카드가 어디서 보이느냐에 따라 제목이 세션 이름이기도, 쓴 사람이기도 하다.
export const REVIEW_PERSPECTIVE = {
  session: "session",
  received: "received",
  written: "written",
} as const;

export type ReviewPerspective = (typeof REVIEW_PERSPECTIVE)[keyof typeof REVIEW_PERSPECTIVE];
