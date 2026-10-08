"use client";

import { Container, Text } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { use } from "react";

import { EmptyState } from "@/shared/ui";

import type { InboxPage, ReadState } from "../model/inbox-page";
import { InboxList } from "./inbox-list";
import { ReloadButton } from "./reload-button";

interface InboxPanelProps {
  inbox: Promise<InboxPage | null>;
  read: ReadState;
  onRead: (notificationId: string) => void;
}

export function InboxPanel({ inbox, read, onRead }: InboxPanelProps) {
  const page = use(inbox);
  if (isNull(page)) {
    return (
      <Container size="sm" className="py-200">
        <EmptyState
          image="empty-error"
          title="받은 알림을 불러오지 못했습니다"
          description="잠시 뒤 다시 시도해 주세요."
          action={<ReloadButton />}
        />
      </Container>
    );
  }
  if (page.items.length === 0) {
    return (
      <Container size="sm" className="py-200">
        <EmptyState
          image="empty-notification"
          title="받은 알림이 없습니다"
          description={
            <>
              새 알림이 오면 여기에 모아 보여 줍니다.
              <Text typography="body5" foreground="hint" render={<span />} className="mt-050 block">
                최근 7일 동안 받은 알림이 없습니다.
              </Text>
            </>
          }
        />
      </Container>
    );
  }
  return (
    <Container size="sm" className="px-0">
      <InboxList inbox={page} read={read} onRead={onRead} />
    </Container>
  );
}
