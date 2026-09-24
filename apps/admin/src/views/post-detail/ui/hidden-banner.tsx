import { Button, HStack, Text } from "@roll-and-call/ui";
import { Eye } from "lucide-react";
import Link from "next/link";

import { formatMonthDay } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { IconBadge } from "@/shared/ui";

interface HiddenBannerProps {
  hidden: NonNullable<PostDetail["hidden"]>;
  logHref: string;
}

// 지금 숨김 중이라는 사실과 사유 한 줄. 이전 조치는 활동 기록에서 본다.
export function HiddenBanner({ hidden, logHref }: HiddenBannerProps) {
  return (
    <HStack
      align="center"
      gap="125"
      className="rounded-500 border border-gray-200 bg-surface px-150 py-125"
    >
      <IconBadge icon={Eye} colorPalette="danger">
        숨김 중
      </IconBadge>
      <Text typography="body3" truncate className="min-w-0 flex-1">
        {hidden.reason}
      </Text>
      <Text typography="body4" foreground="hint" className="whitespace-nowrap">
        {formatMonthDay(hidden.at)} {hidden.by}
      </Text>
      <Button variant="outline" colorPalette="gray" size="sm" render={<Link href={logHref} />}>
        활동 기록에서 보기
      </Button>
    </HStack>
  );
}
