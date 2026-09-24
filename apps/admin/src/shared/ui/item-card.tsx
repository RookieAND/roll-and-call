import { HStack, Text, VStack } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { IconTile } from "./icon-tile";

interface ItemCardProps {
  icon: LucideIcon;
  tone?: "gray" | "primary" | "danger" | "warning";
  title: string;
  meta?: string;
  tags?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
}

export function ItemCard({ icon, tone, title, meta, tags, right, children }: ItemCardProps) {
  return (
    <HStack
      align="start"
      gap="125"
      className="rounded-400 border border-gray-200 bg-surface px-150 py-125"
    >
      <IconTile icon={icon} tone={tone} size="sm" />
      <VStack gap="050" className="min-w-0 flex-1">
        <HStack align="baseline" gap="100" wrap>
          <Text typography="subtitle2">{title}</Text>
          {meta ? (
            <Text typography="body4" foreground="hint">
              {meta}
            </Text>
          ) : null}
          {tags}
        </HStack>
        {children ? (
          <Text typography="body3" foreground="muted" render={<div />}>
            {children}
          </Text>
        ) : null}
      </VStack>
      {right ? <div className="shrink-0 self-center">{right}</div> : null}
    </HStack>
  );
}
