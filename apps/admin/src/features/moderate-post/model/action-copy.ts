import { Bell, Mail, RotateCcw, type LucideIcon } from "lucide-react";

import { withObjectParticle } from "@/shared/lib";

import { POST_ACTION, type PostAction } from "./post-action";

interface ActionCopy {
  title: string;
  description: string;
  footerIcon: LucideIcon;
  footerNote: string;
  confirmLabel: string;
  successMessage: (title: string) => string;
}

export const ACTION_COPY: Record<PostAction, ActionCopy> = {
  [POST_ACTION.edit]: {
    title: "GM에게 수정 요청",
    description: "구인은 그대로 유지됩니다",
    footerIcon: Mail,
    footerNote: "GM에게만 알림이 갑니다",
    confirmLabel: "수정 요청 보내기",
    successMessage: (title) => `GM에게 수정을 요청했습니다 · ${title}`,
  },
  [POST_ACTION.hide]: {
    title: "구인 숨김",
    description: "구인을 새로 보는 사람에게만 보이지 않게 됩니다",
    footerIcon: RotateCcw,
    footerNote: "언제든 숨김 해제할 수 있습니다",
    confirmLabel: "숨김 확정",
    successMessage: (title) => `${withObjectParticle(title)} 숨겼습니다`,
  },
  [POST_ACTION.unhide]: {
    title: "숨김 해제",
    description: "구인이 목록과 검색에 다시 나타납니다",
    footerIcon: Bell,
    footerNote: "해제는 따로 알리지 않습니다",
    confirmLabel: "숨김 해제",
    successMessage: (title) => `숨김을 해제했습니다 · ${title}`,
  },
  [POST_ACTION.resolve]: {
    title: "신고 처리 완료",
    description: "조치 없이 이 구인의 처리 안 된 신고를 처리됨으로 바꿉니다",
    footerIcon: Bell,
    footerNote: "GM과 신고자 모두에게 알리지 않습니다",
    confirmLabel: "처리 완료",
    successMessage: (title) => `신고를 처리 완료했습니다 · ${title}`,
  },
};
