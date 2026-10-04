import { isNull } from "es-toolkit";

import { formatDateTime } from "@/shared/lib";
import { OutcomePanel } from "@/shared/ui";

interface SanctionSummaryProps {
  days: number | null;
  end: Date | null;
  cancelCount: number;
  notifiedCount: number;
  keptCount: number;
}

export function SanctionSummary({
  days,
  end,
  cancelCount,
  notifiedCount,
  keptCount,
}: SanctionSummaryProps) {
  const cancelSub =
    cancelCount > 0
      ? `확정자·대기자 ${notifiedCount}명에게 알림 탭으로 알립니다`
      : "취소하는 구인이 없습니다";
  return (
    <OutcomePanel
      items={[
        {
          label: "제재 기간",
          value: isNull(days) ? "무기한" : `${days}일`,
          sub: end ? `${formatDateTime(end)}까지` : "해제하기 전까지",
          danger: true,
        },
        { label: "취소하는 구인", value: `${cancelCount}건`, sub: cancelSub },
        { label: "그대로 진행하는 활동", value: `${keptCount}건` },
      ]}
    />
  );
}
