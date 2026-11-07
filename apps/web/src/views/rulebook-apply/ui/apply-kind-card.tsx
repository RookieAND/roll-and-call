import { Card, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { ChevronRight, type LucideIcon } from "lucide-react";

import { LineBreaks, ServerLink } from "@/shared/ui";

interface ApplyKindCardProps {
  icon: LucideIcon;
  title: string;
  lines: string[];
  path: string;
  disabled?: boolean;
}

export function ApplyKindCard({
  icon: Icon,
  title,
  lines,
  path,
  disabled = false,
}: ApplyKindCardProps) {
  const render = disabled ? (
    <div role="link" aria-disabled="true" tabIndex={-1} />
  ) : (
    <ServerLink path={path} />
  );
  return (
    <Card.Root
      radius={500}
      interactive={!disabled}
      render={render}
      className={cn("min-h-22", disabled && "cursor-not-allowed")}
    >
      <HStack align="center" gap="150">
        <Icon size={24} strokeWidth={2} aria-hidden className="flex-none" />
        <VStack gap="050" className={cn("min-w-0 flex-1", disabled && "opacity-45")}>
          <Text typography="subtitle2">{title}</Text>
          <Text typography="body3" foreground="muted" className="break-keep" render={<p />}>
            <LineBreaks lines={lines} />
          </Text>
        </VStack>
        <ChevronRight size={16} aria-hidden className="flex-none text-hint" />
      </HStack>
    </Card.Root>
  );
}
