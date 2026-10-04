import {
  NOTIFICATION_GROUP,
  notificationGroup,
  type NotificationKind,
} from "@roll-and-call/database/notifications/model";
import { Calendar, MessageCircle, ShieldCheck, User } from "lucide-react";

const ICON = {
  [NOTIFICATION_GROUP.game]: Calendar,
  [NOTIFICATION_GROUP.cert]: ShieldCheck,
  [NOTIFICATION_GROUP.review]: MessageCircle,
  [NOTIFICATION_GROUP.account]: User,
} as const;

interface NotificationIconProps {
  kind: NotificationKind;
}

export function NotificationIcon({ kind }: NotificationIconProps) {
  const Icon = ICON[notificationGroup(kind)];
  return (
    <span className="flex size-8 flex-none items-center justify-center rounded-full bg-gray-50 text-gray-600">
      <Icon size={18} aria-hidden />
    </span>
  );
}
