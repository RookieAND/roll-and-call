import type { ReactNode } from "react";

import { AppBar, PageShell } from "@/shared/ui";

import { NOTIFICATIONS_CARD_CLASS } from "../lib/notifications-desktop-class";

interface NotificationsFrameProps {
  children: ReactNode;
}

export function NotificationsFrame({ children }: NotificationsFrameProps) {
  return (
    <PageShell appBar={<AppBar title="알림" />}>
      <div className={NOTIFICATIONS_CARD_CLASS}>{children}</div>
    </PageShell>
  );
}
