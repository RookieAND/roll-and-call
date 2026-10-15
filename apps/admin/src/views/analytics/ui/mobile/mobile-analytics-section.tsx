import { HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface MobileAnalyticsSectionProps {
  title: string;
  sub?: string;
  children: ReactNode;
}

export function MobileAnalyticsSection({ title, sub, children }: MobileAnalyticsSectionProps) {
  return (
    <VStack
      gap="125"
      render={<section aria-label={title} />}
      className="rounded-600 border border-gray-200 bg-surface px-175 py-150"
    >
      <HStack align="baseline" gap="100" wrap>
        <Text typography="subtitle1" render={<h2 />}>
          {title}
        </Text>
        {sub ? (
          <Text typography="body4" foreground="hint">
            {sub}
          </Text>
        ) : null}
      </HStack>
      {children}
    </VStack>
  );
}
