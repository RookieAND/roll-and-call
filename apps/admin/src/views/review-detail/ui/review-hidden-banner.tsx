import { Badge, Button, Card, HStack, Text } from "@roll-and-call/ui";

import { formatShortDateTime } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";
import { ServerLink } from "@/shared/ui";

interface ReviewHiddenBannerProps {
  hidden: NonNullable<ReviewDetail["hidden"]>;
  logHref: string;
}

export function ReviewHiddenBanner({ hidden, logHref }: ReviewHiddenBannerProps) {
  return (
    <Card.Root
      padding="none"
      render={<HStack align="center" gap="125" />}
      className="px-150 py-125"
    >
      <Badge colorPalette="warning">숨김 중</Badge>
      <Text typography="body3" truncate className="min-w-0 flex-1">
        사유: {hidden.reasonLabel}
      </Text>
      <Text typography="body4" foreground="hint" className="whitespace-nowrap">
        {formatShortDateTime(hidden.at)} · {hidden.by}
      </Text>
      <Button
        variant="outline"
        colorPalette="gray"
        size="sm"
        render={<ServerLink path={logHref} />}
      >
        활동 기록에서 보기
      </Button>
    </Card.Root>
  );
}
