export const NO_SHOW_STATUS = {
  valid: "valid",
  expired: "expired",
  cancelled: "cancelled",
} as const;
export type NoShowStatus = (typeof NO_SHOW_STATUS)[keyof typeof NO_SHOW_STATUS];

export const NO_SHOW_STATUS_LABEL = {
  [NO_SHOW_STATUS.valid]: "유효",
  [NO_SHOW_STATUS.expired]: "기간 지남",
  [NO_SHOW_STATUS.cancelled]: "취소됨",
} as const satisfies Record<NoShowStatus, string>;
