import {
  NOTIFICATION_GROUP,
  notificationGroup,
  notificationText,
  type NotificationPayload,
} from "@roll-and-call/database/notifications/model";
import { HStack, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { CalendarDays, MessageSquare, ShieldCheck, User } from "lucide-react";

const ICON = {
  [NOTIFICATION_GROUP.game]: CalendarDays,
  [NOTIFICATION_GROUP.cert]: ShieldCheck,
  [NOTIFICATION_GROUP.review]: MessageSquare,
  [NOTIFICATION_GROUP.account]: User,
} as const;

interface NotificationLineProps {
  payload: NotificationPayload;
}

export function NotificationLine({ payload }: NotificationLineProps) {
  const text = notificationText(payload);
  const Icon = ICON[notificationGroup(payload.kind)];
  return (
    <HStack align="start" gap="125">
      <HStack
        align="center"
        justify="center"
        className="size-8 flex-none rounded-full bg-tinted-bg text-tinted-ink"
      >
        <Icon size={16} aria-hidden />
      </HStack>
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="body3">
          {text.pre}
          {isNull(text.strong) ? null : (
            <Text typography="body3" weight="bold" render={<strong />}>
              {text.strong}
            </Text>
          )}
          {text.post}
        </Text>
        {isNull(text.sub) ? null : (
          <Text typography="body4" foreground="muted">
            {text.sub}
          </Text>
        )}
      </VStack>
      <Text typography="body4" foreground="hint" className="flex-none">
        방금
      </Text>
    </HStack>
  );
}
