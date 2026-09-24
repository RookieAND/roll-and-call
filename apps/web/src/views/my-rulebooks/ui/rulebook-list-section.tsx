import { Card, HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface RulebookListSectionProps {
  title: string;
  count?: number;
  children: ReactNode;
}

export function RulebookListSection({ title, count, children }: RulebookListSectionProps) {
  return (
    <VStack gap="125" render={<section />}>
      <HStack align="baseline" gap="100">
        <Text typography="subtitle1" render={<h2 />}>
          {title}
        </Text>
        {count !== undefined && (
          <Text typography="body3" foreground="hint" numeric>
            {count}
          </Text>
        )}
      </HStack>
      <Card.Root
        padding="none"
        className="overflow-hidden [&>*:not(:first-child)]:border-t [&>*:not(:first-child)]:border-gray-100"
      >
        {children}
      </Card.Root>
    </VStack>
  );
}
