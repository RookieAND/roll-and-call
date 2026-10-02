import { USER_DETAIL_TAB } from "./user-detail-tab";

export const USER_DETAIL_TABS = [
  { value: USER_DETAIL_TAB.activity, label: "활동" },
  { value: USER_DETAIL_TAB.cert, label: "룰북 인증" },
  { value: USER_DETAIL_TAB.noShow, label: "불참 기록" },
  { value: USER_DETAIL_TAB.memo, label: "운영진 메모" },
] as const;
