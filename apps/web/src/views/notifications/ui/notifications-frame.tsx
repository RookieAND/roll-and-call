import type { ReactNode } from "react";

import { AppBar, DesktopWideFrame } from "@/shared/ui";

import {
  NOTIFICATIONS_APPBAR_CLASS,
  NOTIFICATIONS_CARD_CLASS,
} from "../lib/notifications-desktop-class";

interface NotificationsFrameProps {
  children: ReactNode;
}

// 모바일은 앱바 아래에 탭이 이어진다. 1100px 이상은 앱바가 영역 전폭 띠이고, 탭과 목록은 가운데 카드(640 또는 880px)에 담긴다.
export function NotificationsFrame({ children }: NotificationsFrameProps) {
  return (
    <div className="group/notif contents">
      <DesktopWideFrame />
      <AppBar title="알림" className={NOTIFICATIONS_APPBAR_CLASS} />
      <div className={NOTIFICATIONS_CARD_CLASS}>{children}</div>
    </div>
  );
}
