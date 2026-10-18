import type { NotificationRow } from "@roll-and-call/database/notifications";
import { isNull } from "es-toolkit";

import type { ReadState } from "./inbox-page";

export function isNotificationUnread({
  row,
  read,
  loadedAt,
}: {
  row: NotificationRow;
  read: ReadState;
  loadedAt: Date;
}) {
  if (!isNull(row.readAt) || read.readIds.has(row.id)) return false;
  return !(read.allRead && row.createdAt <= loadedAt);
}
