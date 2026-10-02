import { HStack, Text } from "@roll-and-call/ui";
import { countBy } from "es-toolkit";

import type { PostDetail } from "@/shared/server";
import { Tag } from "@/shared/ui";

interface ReportSummaryProps {
  reports: PostDetail["reports"];
}

export function ReportSummary({ reports }: ReportSummaryProps) {
  const counts = Object.entries(
    countBy(
      reports.filter((report) => !report.resolved),
      (report) => report.category,
    ),
  ).toSorted(([, a], [, b]) => b - a);
  return (
    <HStack align="center" gap="100" wrap>
      <Text typography="body4" weight="bold" className="w-[72px]">
        신고 요약
      </Text>
      {counts.map(([category, count]) => (
        <Tag key={category} tone="danger">
          {`${category} ${count}건`}
        </Tag>
      ))}
    </HStack>
  );
}
