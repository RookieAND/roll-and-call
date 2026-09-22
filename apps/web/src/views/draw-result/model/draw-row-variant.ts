// highlight: 결과판의 확정 통, plain: 결과판의 대기 통, compact: 신청자가 보는 명단(내 줄만 띄운다).
export const DRAW_ROW_VARIANT = {
  highlight: "highlight",
  plain: "plain",
  compact: "compact",
} as const;

export type DrawRowVariant = (typeof DRAW_ROW_VARIANT)[keyof typeof DRAW_ROW_VARIANT];
