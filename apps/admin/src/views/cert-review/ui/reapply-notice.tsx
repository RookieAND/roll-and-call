import { HStack, Text, VStack } from "@roll-and-call/ui";
import { RotateCcw } from "lucide-react";

import { formatDate } from "@/shared/lib";
import type { PreviousRejection } from "@/shared/server";
import { IconTile } from "@/shared/ui";

interface ReapplyNoticeProps {
  latest: PreviousRejection;
  attempt: number;
}

export function ReapplyNotice({ latest, attempt }: ReapplyNoticeProps) {
  return (
    <VStack
      render={<section aria-label="재신청 안내" />}
      className="overflow-hidden rounded-600 border border-gray-200 bg-surface"
    >
      <HStack
        align="center"
        gap="100"
        className="border-b border-(--rc-color-border-subtle) px-200 py-150"
      >
        <IconTile icon={RotateCcw} tone="primary" />
        <Text typography="heading3" render={<h2 />}>
          {attempt}번째 신청
        </Text>
        <Text typography="body4" foreground="hint">
          이전 신청은 {formatDate(latest.rejectedAt)}에 반려되었습니다
        </Text>
      </HStack>
      <VStack gap="125" className="px-200 py-175">
        <Text typography="subtitle1">지난번 반려 사유</Text>
        <VStack gap="075" render={<ol />}>
          {latest.requests.map((request, index) => (
            <HStack key={request} align="baseline" gap="100" render={<li />}>
              <Text
                typography="body4"
                weight="bold"
                foreground="muted"
                className="grid size-[18px] shrink-0 place-items-center rounded-full bg-gray-100"
              >
                {index + 1}
              </Text>
              <Text typography="body3">{request}</Text>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </VStack>
  );
}
