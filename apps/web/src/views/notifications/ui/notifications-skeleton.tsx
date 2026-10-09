import { Container, Tabs } from "@roll-and-call/ui";

import { AppBar } from "@/shared/ui";

import { NOTIFICATIONS_TAB } from "../model/notifications-tab";
import { CountSkeleton } from "./count-skeleton";
import { InboxSkeleton } from "./inbox-skeleton";

// 라우트 뼈대는 탭을 모르므로 기본 탭([알림])의 줄 뼈대를 그린다.
export function NotificationsSkeleton() {
  return (
    <>
      <AppBar title="알림" />
      <Tabs.Root value={NOTIFICATIONS_TAB.inbox}>
        <Tabs.List
          aria-label="알림"
          scrollable={false}
          className="sticky top-(--rc-size-appbar) z-(--rc-z-sticky) w-full bg-surface"
        >
          <Tabs.Trigger value={NOTIFICATIONS_TAB.todo} className="flex-1">
            할 일
            <CountSkeleton />
          </Tabs.Trigger>
          <Tabs.Trigger value={NOTIFICATIONS_TAB.inbox} className="flex-1">
            알림
            <CountSkeleton />
          </Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Panel value={NOTIFICATIONS_TAB.inbox} className="pt-0">
          <Container size="sm" className="px-0">
            <InboxSkeleton />
          </Container>
        </Tabs.Panel>
      </Tabs.Root>
    </>
  );
}
