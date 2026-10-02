import { Bell, Flag, type LucideIcon } from "lucide-react";

import { REVIEW_ACTION, type ReviewAction } from "./review-action";

interface ActionCopy {
  title: (author: string) => string;
  description: string;
  footerIcon: LucideIcon;
  footerNote: string | null;
  confirmLabel: string;
  successMessage: (author: string) => string;
  networkError: string;
}

export const ACTION_COPY: Record<ReviewAction, ActionCopy> = {
  [REVIEW_ACTION.hide]: {
    title: (author) => `${author}의 후기 숨김`,
    description: "숨긴 후기는 작성자만 볼 수 있습니다",
    footerIcon: Flag,
    footerNote: null,
    confirmLabel: "숨기기",
    successMessage: (author) => `${author}의 후기를 숨겼습니다`,
    networkError: "네트워크 오류로 처리하지 못했습니다. 고른 사유는 그대로 남아 있습니다.",
  },
  [REVIEW_ACTION.unhide]: {
    title: (author) => `${author}의 후기 숨김 해제`,
    description: "GM 프로필에 다시 보입니다",
    footerIcon: Bell,
    footerNote: "해제는 따로 알리지 않습니다",
    confirmLabel: "해제",
    successMessage: (author) => `${author}의 후기 숨김을 해제했습니다`,
    networkError: "네트워크 오류로 처리하지 못했습니다. 고른 사유는 그대로 남아 있습니다.",
  },
  [REVIEW_ACTION.remove]: {
    title: (author) => `${author}의 후기를 제거할까요?`,
    description: "제거한 후기는 되돌릴 수 없습니다",
    footerIcon: Flag,
    footerNote: null,
    confirmLabel: "제거",
    successMessage: (author) => `${author}의 후기를 제거했습니다`,
    networkError: "네트워크 오류로 제거하지 못했습니다. 고른 사유는 그대로 남아 있습니다.",
  },
  [REVIEW_ACTION.dismiss]: {
    title: (author) => `${author}의 후기 신고 기각`,
    description: "후기는 그대로 두고 신고를 닫습니다",
    footerIcon: Bell,
    footerNote: "작성자와 신고자에게 알리지 않습니다",
    confirmLabel: "신고 기각",
    successMessage: (author) => `${author}의 후기 신고를 기각했습니다`,
    networkError: "네트워크 오류로 처리하지 못했습니다. 고른 사유는 그대로 남아 있습니다.",
  },
};

export const CONFLICT_VERB: Record<string, string> = {
  "후기 숨김": "숨김 처리",
  "후기 숨김 해제": "숨김을 해제",
  "후기 제거": "제거",
  "후기 신고 기각": "신고를 기각",
};
