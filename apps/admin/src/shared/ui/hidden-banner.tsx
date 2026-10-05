import { Card, HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { formatDateTime } from "@/shared/lib";

import { Tag } from "./tag";

interface HiddenBannerProps {
  hidden: { at: Date; by: string; reason: string };
  // 사유 아래 덧붙는 줄(후기의 수정 여부 등).
  children?: ReactNode;
}

// 사유는 저장된 그대로다.
export function HiddenBanner({ hidden, children }: HiddenBannerProps) {
  return (
    <Card.Root padding="none" render={<VStack gap="050" />} className="shrink-0 px-150 py-125">
      <HStack align="center" gap="100">
        <Tag>숨김</Tag>
        <Text typography="body3">
          {formatDateTime(hidden.at)}에 {hidden.by}님이 숨겼습니다.
        </Text>
      </HStack>
      <Text typography="body4" foreground="muted">
        사유: {hidden.reason}
      </Text>
      {children}
    </Card.Root>
  );
}
