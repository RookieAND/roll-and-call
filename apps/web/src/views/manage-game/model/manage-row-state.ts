export const MANAGE_ROW_STATE = {
  open: "open",
  blocked: "blocked",
  done: "done",
  locked: "locked",
} as const;
export type ManageRowState = (typeof MANAGE_ROW_STATE)[keyof typeof MANAGE_ROW_STATE];

export type ManageRow = {
  key: "attendance" | "review" | "time" | "roster" | "edit";
  icon: "clipboard" | "message" | "clock" | "check" | "users" | "pencil";
  label: string;
  detail: string;
  href: string | null;
  state: ManageRowState;
};
