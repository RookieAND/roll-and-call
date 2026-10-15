import { USER_DETAIL_TAB } from "./user-detail-tab";

// 모바일은 탭 넷이 한 줄에 들어가도록 이름을 줄인다.
export const USER_DETAIL_MOBILE_TABS = [
  { value: USER_DETAIL_TAB.activity, label: "활동" },
  { value: USER_DETAIL_TAB.cert, label: "인증" },
  { value: USER_DETAIL_TAB.noShow, label: "불참" },
  { value: USER_DETAIL_TAB.memo, label: "메모" },
] as const;
