import { notificationText } from "@roll-and-call/database/notifications/model";
import { HStack, Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { isNull } from "es-toolkit";

import type { NotificationRow } from "@/shared/server";
import { ServerLink } from "@/shared/ui";

import { notificationHref } from "../model/notification-href";
import { notificationTimeLabel } from "../model/notification-time-label";
import { NotificationIcon } from "./notification-icon";

const notificationRow = cva(
  "min-h-16 w-full cursor-pointer py-150 pr-200 pl-100 text-left text-gray-900 transition-colors",
  {
    variants: {
      unread: { true: "bg-tinted-bg hover:bg-tinted-bg-hover", false: "hover:bg-gray-50" },
    },
  },
);

interface NotificationItemProps {
  row: NotificationRow;
  unread: boolean;
  now: Date;
  onRead: (notificationId: string) => void;
}

// 여는 것만으로는 읽음이 아니다. 누를 때 읽음으로 바꾸고, 갈 곳이 있으면 이동한다.
export function NotificationItem({ row, unread, now, onRead }: NotificationItemProps) {
  const text = notificationText(row);
  const href = notificationHref(row);
  const handleClick = () => {
    if (unread) onRead(row.id);
  };
  // ponytail: 줄 전체가 누르는 자리라 Button 모양을 쓰지 않는다. 갈 곳이 없는 줄만 button 태그다.
  const element = isNull(href) ? (
    <button type="button" onClick={handleClick} />
  ) : (
    <ServerLink path={href} onClick={handleClick} />
  );
  const weight = unread ? "extrabold" : "regular";

  return (
    <HStack align="start" gap="125" render={element} className={notificationRow({ unread })}>
      <HStack justify="center" className="w-100 flex-none pt-150">
        {unread && (
          <span role="img" aria-label="안 읽음" className="size-1.5 rounded-full bg-primary-600" />
        )}
      </HStack>
      <NotificationIcon kind={row.kind} />
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="body2" weight={weight} className="line-clamp-2 break-keep">
          {text.pre}
          {text.strong && (
            <Text render={<strong />} typography="body2" weight="extrabold">
              {text.strong}
            </Text>
          )}
          {text.post}
        </Text>
        {text.sub && (
          <Text typography="body4" foreground="hint" className="break-keep">
            {text.sub}
          </Text>
        )}
      </VStack>
      <Text typography="body4" foreground="hint" className="flex-none pt-025">
        {notificationTimeLabel(row.createdAt, now)}
      </Text>
    </HStack>
  );
}
