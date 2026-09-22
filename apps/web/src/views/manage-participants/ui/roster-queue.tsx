import { Card, HStack, Text, VStack } from "@trpg/ui";
import type { ReactNode } from "react";

interface RosterQueueProps {
  label: string;
  count: number;
  caption?: string;
  action?: ReactNode;
  footnote?: ReactNode;
  // 주어지면 목록 테두리 대신 점선 빈 상자를 그린다.
  emptyState?: ReactNode;
  children?: ReactNode;
}

export function RosterQueue({
  label,
  count,
  caption,
  action,
  footnote,
  emptyState,
  children,
}: RosterQueueProps) {
  return (
    <VStack gap="100">
      <HStack align={action ? "center" : "baseline"} gap="100">
        <Text typography="subtitle2" weight="extrabold" render={<h2 />}>
          {label}
        </Text>
        <Text numeric typography="subtitle2" foreground="muted" className="flex-1">
          {count}명
        </Text>
        {caption && !action && (
          <Text typography="body4" foreground="hint">
            {caption}
          </Text>
        )}
        {action}
      </HStack>
      {caption && action && (
        <Text typography="body4" foreground="hint">
          {caption}
        </Text>
      )}
      {emptyState ? (
        <Card
          radius={500}
          background="none"
          padding="none"
          className="border-dashed px-200 py-225 text-center"
        >
          {emptyState}
        </Card>
      ) : (
        <Card radius={500} background="none" padding="none" className="overflow-hidden">
          {children}
        </Card>
      )}
      {footnote}
    </VStack>
  );
}
