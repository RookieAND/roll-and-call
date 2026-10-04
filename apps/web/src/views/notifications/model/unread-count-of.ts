import type { InboxPage, ReadState } from "./inbox-page";

export function unreadCountOf({ inbox, read }: { inbox: InboxPage; read: ReadState }) {
  if (read.allRead) return 0;
  return Math.max(inbox.unread - read.readIds.size, 0);
}
