import { Card, HStack, Text, VStack } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { Tag } from "@/shared/ui";

interface HiddenBannerProps {
  hidden: NonNullable<PostDetail["hidden"]>;
}

// 사유는 저장된 그대로다(칩 이름, 기타면 「기타 · {입력}」).
export function HiddenBanner({ hidden }: HiddenBannerProps) {
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
    </Card.Root>
  );
}
