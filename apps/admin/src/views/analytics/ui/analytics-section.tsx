import { HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

interface AnalyticsSectionProps {
  title: string;
  sub?: string;
  right?: ReactNode;
  insight?: string | null;
  children: ReactNode;
  bodyClassName?: string;
}

export function AnalyticsSection({
  title,
  sub,
  right,
  insight,
  children,
  bodyClassName,
}: AnalyticsSectionProps) {
  return (
    <VStack
      render={<section aria-label={title} />}
      className="overflow-hidden rounded-600 border border-gray-200 bg-surface"
    >
      <HStack
        align="center"
        gap="125"
        render={<header />}
        className="min-h-[52px] border-b border-(--rc-color-border-subtle) px-200 py-150 whitespace-nowrap"
      >
        <Text typography="heading3" render={<h2 />}>
          {title}
        </Text>
        {sub ? (
          <Text typography="body4" foreground="hint">
            {sub}
          </Text>
        ) : null}
        {right ? (
          <HStack align="center" gap="075" className="ml-auto">
            {right}
          </HStack>
        ) : null}
      </HStack>
      {insight ? (
        <HStack
          align="center"
          gap="100"
          className="border-b border-(--rc-color-border-subtle) bg-canvas px-200 py-125"
        >
          <TrendingUp size={14} aria-hidden className="text-(--rc-color-fg-primary)" />
          <Text typography="body3" weight="medium">
            {insight}
          </Text>
        </HStack>
      ) : null}
      <div className={cn("p-200", bodyClassName)}>{children}</div>
    </VStack>
  );
}
