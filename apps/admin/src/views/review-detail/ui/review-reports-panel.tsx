import { Callout, VStack } from "@roll-and-call/ui";
import { Flag } from "lucide-react";

import { formatShortDateTime } from "@/shared/lib";
import type { ReviewDetail } from "@/shared/server";
import { ItemCard, Panel, Tag } from "@/shared/ui";

interface ReviewReportsPanelProps {
  review: ReviewDetail;
}

export function ReviewReportsPanel({ review }: ReviewReportsPanelProps) {
  return (
    <Panel title={`신고 ${review.reports.length}건`}>
      <VStack gap="100" className="p-150">
        {review.editedAfterReport ? (
          <Callout.Root colorPalette="warning" size="sm">
            <Callout.Icon />
            <Callout.Description>
              신고 후 작성자가 고쳤습니다. 지금 본문을 기준으로 판단합니다.
            </Callout.Description>
          </Callout.Root>
        ) : null}
        {review.reports.map((report) => (
          <ItemCard
            key={report.id}
            icon={Flag}
            tone="danger"
            title={report.reporterNickname}
            meta={formatShortDateTime(report.reportedAt)}
            tags={<Tag tone="danger">{report.reason}</Tag>}
          >
            {report.detail || null}
          </ItemCard>
        ))}
      </VStack>
    </Panel>
  );
}
