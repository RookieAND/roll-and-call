import { REVIEW_ACTION, type ReviewAction } from "./review-action";

interface ActionCopy {
  title: string;
  confirmLabel: string;
  successMessage: string;
  widthClassName: string;
}

// 창에는 고를 것과 확정하면 새로 생기는 일만 둔다(D273). 제목에 닉네임을 넣지 않고 부제도 없다.
export const ACTION_COPY: Record<ReviewAction, ActionCopy> = {
  [REVIEW_ACTION.hide]: {
    title: "후기 숨김",
    confirmLabel: "숨기기",
    successMessage: "후기를 숨겼습니다",
    widthClassName: "max-w-[600px]",
  },
  [REVIEW_ACTION.unhide]: {
    title: "후기 숨김 해제",
    confirmLabel: "해제",
    successMessage: "숨김을 해제했습니다",
    widthClassName: "max-w-[520px]",
  },
  [REVIEW_ACTION.remove]: {
    title: "후기 제거",
    confirmLabel: "제거",
    successMessage: "후기를 제거했습니다",
    widthClassName: "max-w-[600px]",
  },
};
