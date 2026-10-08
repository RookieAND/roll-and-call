import { withObjectParticle } from "@/shared/lib";

import { POST_ACTION, type PostAction } from "./post-action";

interface ActionCopy {
  title: string;
  widthClassName: string;
  description: string;
  confirmLabel: string;
  successMessage: (title: string) => string;
}

export const ACTION_COPY: Record<PostAction, ActionCopy> = {
  [POST_ACTION.hide]: {
    widthClassName: "max-w-[620px]",
    title: "구인 숨김",
    description: "목록·검색·달력·링크 미리보기에서 빠지고, 참여자만 상세를 봅니다.",
    confirmLabel: "숨김 확정",
    successMessage: (title) => `${withObjectParticle(title)} 숨겼습니다`,
  },
  [POST_ACTION.unhide]: {
    widthClassName: "max-w-[560px]",
    title: "숨김 해제",
    description: "구인이 목록과 검색에 다시 나타납니다",
    confirmLabel: "숨김 해제",
    successMessage: (title) => `숨김을 해제했습니다 · ${title}`,
  },
  [POST_ACTION.remove]: {
    widthClassName: "max-w-[600px]",
    title: "구인 취소",
    description: '취소한 구인은 "취소됨"으로 남습니다',
    confirmLabel: "구인 취소 확정",
    successMessage: (title) => `구인을 취소했습니다 · ${title}`,
  },
};
