// 운영 관리 상단 단계 배지. 도움말 용어 표(W10)도 같은 표를 쓴다.
export const MANAGE_STAGE = {
  cancelled: "cancelled",
  beforeDraw: "beforeDraw",
  coordinating: "coordinating",
  overdue: "overdue",
  confirmed: "confirmed",
  inProgress: "inProgress",
  ended: "ended",
} as const;

export type ManageStage = (typeof MANAGE_STAGE)[keyof typeof MANAGE_STAGE];

export const MANAGE_STAGE_LABEL = {
  cancelled: "취소됨",
  beforeDraw: "추첨 전",
  coordinating: "조율 중",
  overdue: "기한 지남",
  confirmed: "세션 확정",
  inProgress: "진행 중",
  ended: "끝남",
} as const satisfies Record<ManageStage, string>;

export const MANAGE_STAGE_TONE = {
  cancelled: "danger",
  beforeDraw: "gray",
  coordinating: "gray",
  overdue: "gray",
  confirmed: "gray",
  inProgress: "primary",
  ended: "gray",
} as const satisfies Record<ManageStage, "primary" | "danger" | "gray">;
