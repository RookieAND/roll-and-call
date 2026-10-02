import { VStack } from "@roll-and-call/ui";
import { Quote } from "lucide-react";

import { formatDateTime } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { ItemCard, Tag } from "@/shared/ui";

import { reportTone } from "../model/report-tone";

interface ReportPanelProps {
  reports: PostDetail["reports"];
}

// 어드민에서는 스포일러를 가리지 않는다.
export function ReportPanel({ reports }: ReportPanelProps) {
  const ordered = [
    ...reports.filter((report) => !report.resolved),
    ...reports.filter((report) => report.resolved),
  ];
  return (
    <VStack gap="125" className="p-150">
      {ordered.map((report) => {
        const tone = reportTone(report);
        return (
          <div key={report.id} className={report.resolved ? "opacity-60" : undefined}>
            <ItemCard
              icon={Quote}
              tone={tone}
              title={report.reporterNickname}
              meta={formatDateTime(report.reportedAt)}
              tags={
                <>
                  <Tag tone={tone}>{report.category}</Tag>
                  {report.resolved ? <Tag>처리됨</Tag> : null}
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
