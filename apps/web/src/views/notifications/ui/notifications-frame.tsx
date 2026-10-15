import type { ReactNode } from "react";

import { AppBar, PageShell, WIDE_INNER_PX, WIDE_SHELL_CLASS } from "@/shared/ui";

import { NOTIFICATIONS_CARD_CLASS } from "../lib/notifications-desktop-class";

interface NotificationsFrameProps {
  children: ReactNode;
}

// 모바일은 앱바 아래에 탭이 이어진다. 1100px 이상은 앱바가 영역 전폭 띠이고, 탭과 목록은 구인 목록과 같은 폭의 카드에 담긴다.
export function NotificationsFrame({ children }: NotificationsFrameProps) {
  return (
    <PageShell appBar={<AppBar title="알림" />} bare className={WIDE_SHELL_CLASS}>
      <div className={`desktop:pt-300 desktop:pb-400 ${WIDE_INNER_PX}`}>
        <div className={NOTIFICATIONS_CARD_CLASS}>{children}</div>
      </div>
    </PageShell>
  );
}
