import { isNull } from "es-toolkit";

import type { NotificationRow } from "@/shared/server";

import type { NotificationsPage } from "../model/inbox-page";

type WireRow = Omit<NotificationRow, "createdAt" | "readAt"> & {
  createdAt: string;
  readAt: string | null;
};

export async function fetchNotificationsPage({
  slug,
  cursor,
}: {
  slug: string;
  cursor: string;
}): Promise<NotificationsPage> {
  const query = new URLSearchParams({ server: slug, cursor });
  const response = await fetch(`/api/me/notifications?${query}`);
  if (!response.ok) throw new Error(`notifications ${response.status}`);
  const body = (await response.json()) as { items: WireRow[]; nextCursor: string | null };
  return {
    nextCursor: body.nextCursor,
    items: body.items.map(
      (item) =>
        ({
          ...item,
          createdAt: new Date(item.createdAt),
          readAt: isNull(item.readAt) ? null : new Date(item.readAt),
        }) as NotificationRow,
    ),
  };
}
