export const MANAGE_ROW_STATE = {
  open: "open",
  blocked: "blocked",
  done: "done",
  locked: "locked",
} as const;
export type ManageRowState = (typeof MANAGE_ROW_STATE)[keyof typeof MANAGE_ROW_STATE];

// 주소 대신 확인 창을 여는 줄. 지금은 출석 확인 줄의 세션 마치기 하나다(D242).
export const MANAGE_ROW_ACTION = {
  endSession: "endSession",
} as const;
export type ManageRowAction = (typeof MANAGE_ROW_ACTION)[keyof typeof MANAGE_ROW_ACTION];

export type ManageRow = {
  key: "attendance" | "review" | "time" | "roster" | "edit";
  icon: "clipboard" | "message" | "clock" | "check" | "users" | "pencil";
  label: string;
  detail: string;
  // 줄 아래에 덧붙이는 안내 한 줄. 줄을 누르는 동작은 그대로다.
  note?: string;
  href: string | null;
  action?: ManageRowAction;
  state: ManageRowState;
  // 줄 아래에 따로 붙는 GM 마스터링 후기 버튼. 줄 전체가 링크라 줄 안에 넣지 않는다.
  button?: { label: string; href: string; solid: boolean; caption?: string };
};
