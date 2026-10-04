import { HStack, Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { Calendar } from "lucide-react";
import type { ReactNode } from "react";

const noticeRow = cva("rounded-500 py-125 pr-150 pl-075", {
  variants: { unread: { true: "bg-tinted-bg", false: "bg-gray-50" } },
});

interface NoticePreviewRowProps {
  title: string;
  children: ReactNode;
  sub?: string;
  time: string;
  unread?: boolean;
}

// 알림 탭 [알림] 줄을 줄인 정적 장식. 눌리지 않는다.
export function NoticePreviewRow({
  title,
  children,
  sub,
  time,
  unread = false,
}: NoticePreviewRowProps) {
  return (
    <HStack align="start" gap="100" className={noticeRow({ unread })}>
      <HStack justify="center" className="w-100 flex-none pt-150">
        {unread && (
          <span role="img" aria-label="안 읽음" className="size-1.5 rounded-full bg-primary-600" />
        )}
      </HStack>
      <span className="flex size-8 flex-none items-center justify-center rounded-full bg-surface text-gray-600">
        <Calendar size={16} aria-hidden />
      </span>
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="body3" className="break-keep">
          <Text typography="body3" weight="extrabold" render={<strong />}>
            {title}
          </Text>
          {children}
        </Text>
        {sub && (
          <Text typography="body4" foreground="hint" numeric>
            {sub}
          </Text>
        )}
      </VStack>
      <Text typography="body4" foreground="hint" numeric className="flex-none pt-025">
        {time}
      </Text>
    </HStack>
  );
}
