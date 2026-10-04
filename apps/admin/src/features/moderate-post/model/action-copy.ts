import { Bell, RotateCcw, type LucideIcon } from "lucide-react";

import { withObjectParticle } from "@/shared/lib";

import { POST_ACTION, type PostAction } from "./post-action";

interface ActionCopy {
  title: string;
  widthClassName: string;
  description: string;
  footerIcon: LucideIcon;
  footerNote: string;
  confirmLabel: string;
  successMessage: (title: string) => string;
}

export type FormAction = Exclude<PostAction, typeof POST_ACTION.remove>;

export const ACTION_COPY: Record<FormAction, ActionCopy> = {
  [POST_ACTION.hide]: {
    widthClassName: "max-w-[620px]",
    title: "구인 숨김",
    description: "구인을 새로 보는 사람에게만 보이지 않게 됩니다",
    footerIcon: RotateCcw,
    footerNote: "언제든 숨김 해제할 수 있습니다",
    confirmLabel: "숨김 확정",
    successMessage: (title) => `${withObjectParticle(title)} 숨겼습니다`,
  },
  [POST_ACTION.unhide]: {
    widthClassName: "max-w-[560px]",
    title: "숨김 해제",
    description: "구인이 목록과 검색에 다시 나타납니다",
    footerIcon: Bell,
    footerNote: "해제는 따로 알리지 않습니다",
    confirmLabel: "숨김 해제",
    successMessage: (title) => `숨김을 해제했습니다 · ${title}`,
  },
};
