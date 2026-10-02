import { Button, HStack, Text } from "@roll-and-call/ui";

import { formatDate } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { ServerLink, Tag } from "@/shared/ui";

interface HiddenBannerProps {
  hidden: NonNullable<PostDetail["hidden"]>;
  logHref: string;
}

export function HiddenBanner({ hidden, logHref }: HiddenBannerProps) {
  return (
    <HStack
      align="center"
      gap="125"
      className="rounded-500 border border-gray-200 bg-surface px-150 py-125"
    >
      <Tag>숨김 중</Tag>
      <Text typography="body3" truncate className="min-w-0 flex-1">
        {hidden.reason}
      </Text>
      <Text typography="body4" foreground="hint" className="whitespace-nowrap">
        {formatDate(hidden.at)} {hidden.by}
      </Text>
      <Button
        variant="outline"
        colorPalette="gray"
        size="sm"
        render={<ServerLink path={logHref} />}
      >
        활동 기록에서 보기
      </Button>
    </HStack>
  );
}
