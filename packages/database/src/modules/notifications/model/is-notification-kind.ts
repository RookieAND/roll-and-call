import { NOTIFICATION_KIND, type NotificationKind } from "./notification-kind";

export const NOTIFICATION_KINDS: readonly NotificationKind[] = Object.values(NOTIFICATION_KIND);

export function isNotificationKind(value: string): value is NotificationKind {
  return (NOTIFICATION_KINDS as readonly string[]).includes(value);
}
