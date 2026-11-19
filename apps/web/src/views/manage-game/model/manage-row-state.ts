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
  key: "attendance" | "end" | "review" | "reviewWrite" | "time" | "roster" | "edit" | "rounds";
  icon: "clipboard" | "flag" | "message" | "clock" | "users" | "pencil" | "calendar";
  label: string;
  detail: string;
  href: string | null;
  action?: ManageRowAction;
  // 다회차의 회차 마치기. 이 회차만 마치고, 마지막 회차면 확인 창에 한 줄을 더한다.
  round?: { roundNo: number; lastRound: boolean; plannedEndAt: Date };
  // 줄 오른쪽의 글자 버튼. 줄 자체의 이동과 따로 간다.
  extraAction?: { label: string; href: string };
  state: ManageRowState;
};
