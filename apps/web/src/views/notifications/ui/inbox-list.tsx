"use client";

import { Text, VStack } from "@roll-and-call/ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { isNull, uniqBy } from "es-toolkit";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { InlineRetry } from "@/shared/ui";

import { fetchNotificationsPage } from "../api/fetch-notifications-page";
import { groupNotificationsByDay } from "../model/group-notifications-by-day";
import type { InboxPage, NotificationsPage, ReadState } from "../model/inbox-page";
import { isNotificationUnread } from "../model/is-notification-unread";
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
  // 첫 페이지는 서버가 그려 준 것이라 다시 받지 않는다. 서버가 새로 그리면 loadedAt이 바뀌어 새 목록이 된다.
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetchNextPageError } =
    useInfiniteQuery({
      queryKey: ["notifications", server, inbox.loadedAt.toISOString()],
      queryFn: ({ pageParam }) => fetchNotificationsPage({ slug: server, cursor: pageParam }),
      initialPageParam: "",
      getNextPageParam: (lastPage: NotificationsPage) => lastPage.nextCursor,
      initialData: { pages: [inbox], pageParams: [""] },
      staleTime: Infinity,
    });
  const sentinel = useRef<HTMLDivElement>(null);
  const canLoadMore = hasNextPage && !isFetchingNextPage && !isFetchNextPageError;
  const loadMore = () => void fetchNextPage();

  useEffect(() => {
    const target = sentinel.current;
    if (isNull(target) || !canLoadMore) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void fetchNextPage();
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [canLoadMore, fetchNextPage]);

  const items = uniqBy(
    data.pages.flatMap((page) => page.items),
    (item) => item.id,
  );
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
      {isFetchingNextPage && <NotificationRowsSkeleton count={2} />}
      {isFetchNextPageError && <InlineRetry onRetry={loadMore} />}
      <div ref={sentinel} aria-hidden />
      <Text typography="body4" foreground="hint" className="px-200 pt-250 pb-300 text-center">
        최근 7일 동안 받은 알림만 보입니다.
      </Text>
    </VStack>
  );
}
