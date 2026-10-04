import { uniqBy } from "es-toolkit";

import type { NotificationInput } from "./notification-kind";

// 자기 조치로 자기에게는 알림을 만들지 않는다(R14). 같은 호출 안의 똑같은 항목은 하나만 남긴다.
export function dropOwnNotifications({
  actorId,
  notifications,
}: {
  actorId: string | null;
  notifications: NotificationInput[];
}): NotificationInput[] {
  const others = notifications.filter((notification) => notification.userId !== actorId);
  return uniqBy(others, (notification) =>
    JSON.stringify([notification.userId, notification.kind, sortedParams(notification.params)]),
  );

  function sortedParams(params: object) {
    return Object.entries(params).toSorted(([left], [right]) => left.localeCompare(right));
  }
}
