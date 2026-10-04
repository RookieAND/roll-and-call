import type { NotificationRow } from "@/shared/server";

export type NotificationsPage = { items: NotificationRow[]; nextCursor: string | null };

// loadedAt은 첫 페이지를 읽은 시각이다. [모두 읽음]의 upTo이고, 「N분 전」을 셀 기준이다.
export type InboxPage = NotificationsPage & { unread: number; loadedAt: Date };

// 화면에서 먼저 읽음으로 바꾼 것. readIds는 안 읽음이던 줄만 담는다.
export type ReadState = { readIds: ReadonlySet<string>; allRead: boolean };
