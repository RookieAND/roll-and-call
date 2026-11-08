import { Card, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { AttendanceStats } from "./attendance-stats";

interface AttendanceSummaryPanelProps {
  presentCount: number;
  absentCount: number;
  guide: ReactNode;
  action?: ReactNode;
}

// 1100px 이상에서 본문 카드 오른쪽에 붙는다. 모바일에서는 통계·안내·버튼이 본문 안에 따로 놓인다.
export function AttendanceSummaryPanel({
  presentCount,
  absentCount,
  guide,
  action,
}: AttendanceSummaryPanelProps) {
  return (
    <Card.Root radius={600} padding="md">
      <VStack gap="150">
        <Text typography="subtitle2" render={<h2 />}>
          출석 요약
        </Text>
        <AttendanceStats presentCount={presentCount} absentCount={absentCount} />
        <div className="border-t border-gray-200 pt-150">
          <VStack gap="150">
            {guide}
            {action}
          </VStack>
        </div>
      </VStack>
    </Card.Root>
  );
}
