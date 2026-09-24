import { Badge, VStack } from "@roll-and-call/ui";
import { Quote } from "lucide-react";

import { formatDateTime } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { ItemCard } from "@/shared/ui";

const SPOILER = "스포일러";

interface ReportPanelProps {
  reports: PostDetail["reports"];
}

// 처리 안 된 신고를 먼저, 처리된 신고는 흐리게 뒤에 둔다. 어드민에서는 스포일러를 가리지 않는다.
export function ReportPanel({ reports }: ReportPanelProps) {
  const ordered = [
    ...reports.filter((report) => !report.resolved),
    ...reports.filter((report) => report.resolved),
  ];
  return (
    <VStack gap="125" className="p-150">
      {ordered.map((report) => {
        const tone = report.resolved ? "gray" : report.category === SPOILER ? "warning" : "danger";
        return (
          <div key={report.id} className={report.resolved ? "opacity-60" : undefined}>
            <ItemCard
              icon={Quote}
              tone={tone}
              title={report.reporterNickname}
              meta={formatDateTime(report.reportedAt)}
              tags={
                <>
                  <Badge colorPalette={tone}>{report.category}</Badge>
                  {report.resolved ? <Badge colorPalette="gray">처리됨</Badge> : null}
                </>
              }
            >
              {report.detail}
            </ItemCard>
          </div>
        );
      })}
    </VStack>
  );
}
