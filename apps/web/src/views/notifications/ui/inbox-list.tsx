"use client";

import { Text, VStack } from "@roll-and-call/ui";
import { isNull, uniqBy } from "es-toolkit";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { NotificationRow } from "@/shared/server";
import { InlineRetry } from "@/shared/ui";

import { fetchNotificationsPage } from "../api/fetch-notifications-page";
import { groupNotificationsByDay } from "../model/group-notifications-by-day";
import type { InboxPage, ReadState } from "../model/inbox-page";
import { isNotificationUnread } from "../model/is-notification-unread";
import { LOAD_STATUS, type LoadStatus } from "../model/load-status";
import { NotificationItem } from "./notification-item";
import { NotificationRowsSkeleton } from "./notification-rows-skeleton";

interface InboxListProps {
  inbox: InboxPage;
  read: ReadState;
  onRead: (notificationId: string) => void;
}

// 20건씩 읽는다. 목록 끝이 보이면 다음 페이지를 이어 붙이고, 같은 줄이 두 번 와도 한 번만 그린다.
export function InboxList({ inbox, read, onRead }: InboxListProps) {
  const { server } = useParams<{ server: string }>();
  const [more, setMore] = useState<NotificationRow[]>([]);
  const [cursor, setCursor] = useState(inbox.nextCursor);
  const [status, setStatus] = useState<LoadStatus>(LOAD_STATUS.idle);
  const sentinel = useRef<HTMLDivElement>(null);

  const loadMore = async () => {
    if (isNull(cursor)) return;
    setStatus(LOAD_STATUS.loading);
    try {
      const page = await fetchNotificationsPage({ slug: server, cursor });
      setMore((previous) => [...previous, ...page.items]);
      setCursor(page.nextCursor);
      setStatus(LOAD_STATUS.idle);
    } catch {
      setStatus(LOAD_STATUS.error);
    }
  };

  useEffect(() => {
    const target = sentinel.current;
    if (isNull(target) || isNull(cursor) || status !== LOAD_STATUS.idle) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void loadMore();
    });
    observer.observe(target);
    return () => observer.disconnect();
  });

  const items = uniqBy([...inbox.items, ...more], (item) => item.id);
  const groups = groupNotificationsByDay({ items, now: inbox.loadedAt });

  return (
    <VStack>
      {groups.map((group) => (
        <VStack key={group.label} render={<section />}>
          <Text
            typography="body4"
            weight="bold"
            foreground="muted"
            render={<h2 />}
            className="px-200 pt-175 pb-075"
          >
            {group.label}
          </Text>
          {group.items.map((row) => (
            <NotificationItem
              key={row.id}
              row={row}
              unread={isNotificationUnread({ row, read, loadedAt: inbox.loadedAt })}
              now={inbox.loadedAt}
              onRead={onRead}
            />
          ))}
        </VStack>
      ))}
      {status === LOAD_STATUS.loading && <NotificationRowsSkeleton count={2} />}
      {status === LOAD_STATUS.error && <InlineRetry onRetry={loadMore} />}
      <div ref={sentinel} aria-hidden />
      <Text typography="body4" foreground="hint" className="px-200 pt-250 pb-300 text-center">
        최근 7일 동안 받은 알림만 보입니다.
      </Text>
    </VStack>
  );
}
