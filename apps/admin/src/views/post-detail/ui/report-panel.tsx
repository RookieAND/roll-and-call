import { Text, VStack } from "@roll-and-call/ui";
import { Quote } from "lucide-react";

import { formatDateTime, formatMonthDay } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { ItemCard } from "@/shared/ui";

const SPOILER = "스포일러";

interface ReportPanelProps {
  reports: PostDetail["reports"];
}

// 처리 안 된 신고를 먼저, 처리된 신고는 흐리게 뒤에 둔다. 어드민에서는 스포일러를 가리지 않는다.
export function ReportPanel({ reports }: ReportPanelProps) {
  const unresolved = reports.filter((report) => !report.resolved);
  const ordered = [...unresolved, ...reports.filter((report) => report.resolved)];
  const summary = unresolved.length
    ? `처리 안 된 신고 ${unresolved.length}건 · ${formatMonthDay(unresolved[0]!.reportedAt)}부터 접수`
    : `처리된 신고 ${reports.length}건`;
  return (
    <VStack gap="125" className="p-150">
      <Text typography="body4" foreground="hint">
        {summary}
      </Text>
      {ordered.map((report) => {
        const tone = report.resolved ? "gray" : report.category === SPOILER ? "warning" : "danger";
        const meta = `${formatDateTime(report.reportedAt)} · ${report.category}${report.resolved ? " · 처리됨" : ""}`;
        return (
          <div key={report.id} className={report.resolved ? "opacity-60" : undefined}>
            <ItemCard icon={Quote} tone={tone} title={report.reporterNickname} meta={meta}>
              {report.detail}
            </ItemCard>
          </div>
        );
      })}
    </VStack>
  );
}
