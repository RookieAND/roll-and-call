"use client";

import { Container, Tabs } from "@roll-and-call/ui";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";

import { markNotificationRead } from "@/features/read-notifications";
import { AppBar } from "@/shared/ui";

import type { InboxPage } from "../model/inbox-page";
import { NOTIFICATIONS_TAB, type NotificationsTab } from "../model/notifications-tab";
import { CountSkeleton } from "./count-skeleton";
import { InboxPanel } from "./inbox-panel";
import { InboxSkeleton } from "./inbox-skeleton";
import { ReadAllButton } from "./read-all-button";
import { UnreadCount } from "./unread-count";

interface NotificationsScreenProps {
  todoCount: ReactNode;
  todoPanel: ReactNode;
  inbox: Promise<InboxPage | null>;
}

// 할 일·받은 알림은 따로 불러와서 한쪽이 늦거나 실패해도 다른 쪽을 막지 않는다.
export function NotificationsScreen({ todoCount, todoPanel, inbox }: NotificationsScreenProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [readIds, setReadIds] = useState<ReadonlySet<string>>(() => new Set());
  const [allRead, setAllRead] = useState(false);
  const read = { readIds, allRead };
  const tab: NotificationsTab =
    searchParams.get("tab") === NOTIFICATIONS_TAB.todo
      ? NOTIFICATIONS_TAB.todo
      : NOTIFICATIONS_TAB.inbox;

  // ponytail: 탭은 주소만 바꾼다(history.replaceState). 서버를 다시 부르지 않고, 뒤로 가기가 탭 사이를 오가지 않는다.
  const changeTab = (next: string) => {
    const url =
      next === NOTIFICATIONS_TAB.todo ? `${pathname}?tab=${NOTIFICATIONS_TAB.todo}` : pathname;
    window.history.replaceState(null, "", url);
  };

  // 결과를 기다리지 않는다. 실패하면 다음에 열 때 다시 안 읽음으로 보일 뿐이다.
  const readOne = (notificationId: string) => {
    setReadIds((previous) => new Set(previous).add(notificationId));
    markNotificationRead(notificationId).catch(() => undefined);
  };

  const readAllAction = tab === NOTIFICATIONS_TAB.inbox && (
    <Suspense fallback={null}>
      <ReadAllButton inbox={inbox} read={read} onAllRead={setAllRead} />
    </Suspense>
  );

  return (
    <>
      <AppBar title="알림" action={readAllAction} />
      <Tabs.Root value={tab} onValueChange={changeTab}>
        <Tabs.List
          aria-label="알림"
          scrollable={false}
          className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) w-full bg-surface"
        >
          <Tabs.Trigger value={NOTIFICATIONS_TAB.todo} className="flex-1">
            할 일{todoCount}
          </Tabs.Trigger>
          <Tabs.Trigger value={NOTIFICATIONS_TAB.inbox} className="flex-1">
            알림
            <Suspense fallback={<CountSkeleton />}>
              <UnreadCount inbox={inbox} read={read} />
            </Suspense>
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Panel value={NOTIFICATIONS_TAB.todo} keepMounted className="pt-0">
          <Container size="sm" className="py-200">
            {todoPanel}
          </Container>
        </Tabs.Panel>
        <Tabs.Panel value={NOTIFICATIONS_TAB.inbox} keepMounted className="pt-0">
          <Suspense fallback={<InboxSkeleton />}>
            <InboxPanel inbox={inbox} read={read} onRead={readOne} />
          </Suspense>
        </Tabs.Panel>
      </Tabs.Root>
    </>
  );
}
