import { isNull } from "es-toolkit";

import type { NotificationRow } from "@/shared/server";

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
