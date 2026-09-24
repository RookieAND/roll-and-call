import { Button, HStack, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { PENDING_COPY } from "@/shared/lib";
import type { PendingItem } from "@/shared/server";
import { IconTile } from "@/shared/ui";

interface PendingRowProps {
  item: PendingItem;
}

export function PendingRow({ item }: PendingRowProps) {
  const copy = PENDING_COPY[item.kind];
  const primary = item.kind === "cert";
  const tone = primary ? "primary" : "gray";
  const countClassName = primary ? "text-(--rc-color-bg-primary)" : undefined;
  return (
    <HStack
      align="center"
      gap="150"
      render={<li />}
      className="border-b border-(--rc-color-border-subtle) px-175 py-125 last:border-b-0"
    >
      <IconTile icon={copy.icon} tone={tone} size="lg" />
      <VStack gap="025" className="min-w-0">
        <Text typography="subtitle1" className="leading-[1.25]">
          {copy.label}
        </Text>
        <Text typography="body4" foreground="hint" className="leading-[1.35]">
          {copy.homeSub(item.oldestDays)}
        </Text>
      </VStack>
      <HStack align="center" gap="175" className="ml-auto">
        <Text typography="heading3" weight="extrabold" numeric className={countClassName}>
          {item.count}건
        </Text>
        <Button variant="outline" size="sm" render={<Link href={copy.href} />}>
          처리하기
        </Button>
      </HStack>
    </HStack>
  );
}
