import { Button, HStack, Text, VStack } from "@roll-and-call/ui";

import { PENDING_COPY } from "@/shared/lib";
import type { PendingItem } from "@/shared/server";
import { IconTile, ServerLink } from "@/shared/ui";

import { isLongWait } from "../../model/is-long-wait";

interface MobilePendingTodoProps {
  item: PendingItem;
}

export function MobilePendingTodo({ item }: MobilePendingTodoProps) {
  const copy = PENDING_COPY[item.kind];
  const primary = isLongWait(item.oldestDays);
  const tone = primary ? "primary" : "gray";
  const countClassName = primary ? "text-(--rc-color-bg-primary)" : undefined;
  return (
    <VStack
      gap="100"
      render={<li />}
      className="border-b border-(--rc-color-border-subtle) px-175 py-150 last:border-b-0"
    >
      <HStack align="center" gap="125">
        <IconTile icon={copy.icon} tone={tone} size="lg" />
        <Text typography="subtitle1" className="min-w-0 flex-1">
          {copy.label}
        </Text>
        <Text typography="heading3" weight="bold" numeric className={countClassName}>
          {item.count}건
        </Text>
      </HStack>
      <Text typography="body4" foreground="hint" className="leading-normal">
        {copy.homeSub(item.oldestDays)}
      </Text>
      <Button
        variant="outline"
        colorPalette="gray"
        render={<ServerLink path={copy.href(item.oldestId)} />}
        className="h-11 w-full"
      >
        처리하기
      </Button>
    </VStack>
  );
}
