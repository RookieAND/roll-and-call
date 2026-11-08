export const MANAGE_ROW_STATE = {
  open: "open",
  blocked: "blocked",
  done: "done",
  locked: "locked",
} as const;
export type ManageRowState = (typeof MANAGE_ROW_STATE)[keyof typeof MANAGE_ROW_STATE];

// 주소 대신 세션 마치기 확인 창을 여는 줄.
export const MANAGE_ROW_ACTION = {
  endSession: "endSession",
} as const;
export type ManageRowAction = (typeof MANAGE_ROW_ACTION)[keyof typeof MANAGE_ROW_ACTION];

export const MANAGE_ROW_DETAIL = {
  notEnded: "세션이 끝난 뒤에 쓸 수 있습니다",
  noConfirmed: "확정 참여자가 없습니다",
} as const;

export type ManageRow = {
  key: "attendance" | "end" | "review" | "reviewWrite" | "time" | "roster" | "edit";
  icon: "clipboard" | "flag" | "message" | "clock" | "users" | "pencil";
  label: string;
  detail: string;
  href: string | null;
  action?: ManageRowAction;
  state: ManageRowState;
};
