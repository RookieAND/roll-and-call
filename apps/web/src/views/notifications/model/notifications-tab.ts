export const NOTIFICATIONS_TAB = { todo: "todo", inbox: "inbox" } as const;

export type NotificationsTab = (typeof NOTIFICATIONS_TAB)[keyof typeof NOTIFICATIONS_TAB];
