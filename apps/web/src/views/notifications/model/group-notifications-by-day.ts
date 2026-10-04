import type { NotificationRow } from "@/shared/server";

import { notificationDayLabel } from "./notification-day-label";

// 목록이 최신순이라 같은 날은 이어 붙어 온다. 알림이 있는 날만 머리가 생긴다.
export function groupNotificationsByDay({
  items,
  now,
}: {
  items: NotificationRow[];
  now: Date;
}): { label: string; items: NotificationRow[] }[] {
  const groups: { label: string; items: NotificationRow[] }[] = [];
  for (const item of items) {
    const label = notificationDayLabel(item.createdAt, now);
    const last = groups.at(-1);
    if (last?.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }
  return groups;
}
