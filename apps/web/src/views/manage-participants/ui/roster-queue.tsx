import { Card, HStack, Text, VStack } from "@trpg/ui";
import type { ReactNode } from "react";

interface RosterQueueProps {
  label: string;
  count: number;
  caption?: string;
  footnote?: ReactNode;
  children: ReactNode;
}

export function RosterQueue({ label, count, caption, footnote, children }: RosterQueueProps) {
  return (
    <VStack gap="100">
      <HStack align="baseline" gap="100">
        <Text typography="subtitle2" weight="extrabold" render={<h2 />}>
          {label}
        </Text>
        <Text numeric typography="subtitle2" foreground="muted" className="flex-1">
          {count}명
        </Text>
        {caption && (
          <Text typography="body4" foreground="hint">
            {caption}
          </Text>
        )}
      </HStack>
      <Card radius={500} background="none" padding="none" className="overflow-hidden">
        {children}
      </Card>
      {footnote}
    </VStack>
  );
}
