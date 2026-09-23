import { Card, HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface RosterQueueProps {
  label: string;
  count: number;
  // 제목 옆 배지(예: 추첨 결과).
  tag?: ReactNode;
  // 오른쪽 끝 한 자리: 버튼이나 순서 설명.
  trailing?: ReactNode;
  footnote?: ReactNode;
  // 주어지면 목록 테두리 대신 점선 빈 상자를 그린다.
  emptyState?: ReactNode;
  children?: ReactNode;
}

export function RosterQueue({
  label,
  count,
  tag,
  trailing,
  footnote,
  emptyState,
  children,
}: RosterQueueProps) {
  return (
    <VStack gap="125">
      <HStack align="center" gap="075" className="min-h-8">
        <Text typography="subtitle1" render={<h2 />}>
          {label}
        </Text>
        <Text numeric typography="subtitle2" foreground="muted">
          {count}명
        </Text>
        {tag}
        <span className="flex-1" />
        {trailing}
      </HStack>
      {emptyState ? (
        <Card.Root
          radius={500}
          background="none"
          padding="none"
          className="border-dashed px-200 py-225 text-center"
        >
          {emptyState}
        </Card.Root>
      ) : (
        <Card.Root
          radius={500}
          padding="none"
          className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
        >
          {children}
        </Card.Root>
      )}
      {footnote}
    </VStack>
  );
}
