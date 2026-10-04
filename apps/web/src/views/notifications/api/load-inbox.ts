import "server-only";
import { countUnreadNotifications, listNotifications } from "@/shared/server";

import type { InboxPage } from "../model/inbox-page";

export async function loadInbox({
  serverId,
  userId,
}: {
  serverId: string;
  userId: string;
}): Promise<InboxPage> {
  const loadedAt = new Date();
  const [page, unread] = await Promise.all([
    listNotifications({ serverId, userId, cursor: null, now: loadedAt }),
    countUnreadNotifications({ serverId, userId, now: loadedAt }),
  ]);
  return { ...page, unread, loadedAt };
}
