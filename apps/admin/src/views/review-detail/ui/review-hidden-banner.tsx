import { Card, HStack, Text, VStack } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";
import { Tag } from "@/shared/ui";

interface ReviewHiddenBannerProps {
  hidden: NonNullable<ReviewDetail["hidden"]>;
  held: boolean;
}

export function ReviewHiddenBanner({ hidden, held }: ReviewHiddenBannerProps) {
  const editedLine = hidden.editedAfterHidden
    ? "숨긴 뒤 작성자가 후기를 고쳤습니다."
    : "숨긴 뒤 작성자가 후기를 고치지 않았습니다.";
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
      <Text typography="body4" foreground="muted">
        {editedLine}
      </Text>
      {held ? (
        <Text typography="body4" foreground="muted">
          작성자가 불참으로 기록되어 해제해도 공개되지 않습니다.
        </Text>
      ) : null}
    </Card.Root>
  );
}
