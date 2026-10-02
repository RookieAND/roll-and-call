import { HStack, Text } from "@roll-and-call/ui";

import type { ReviewDetail } from "@/shared/server";
import { Tag } from "@/shared/ui";

interface ReportSummaryProps {
  reasonCounts: ReviewDetail["reasonCounts"];
}

export function ReportSummary({ reasonCounts }: ReportSummaryProps) {
  return (
    <HStack align="center" gap="100" wrap>
      <Text typography="body4" weight="bold" className="w-[72px]">
        신고 요약
      </Text>
      {reasonCounts.map(({ name, count }) => (
        <Tag key={name} tone="danger">{`${name} ${count}건`}</Tag>
      ))}
    </HStack>
  );
}
