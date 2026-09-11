import { Card, Text, VStack } from "@trpg/ui";
import { formatDateTime } from "@/shared/lib";
import { StatCard } from "@/shared/ui";

// 화면 맨 위 요약: 신청 · 정원 · 마감 세 지표와 마감이 무슨 뜻인지에 대한 한 줄.
export function RosterStats({
  total,
  maxPlayers,
  deadlineLabel,
  urgent,
  endDate,
}: {
  total: number;
  maxPlayers: number;
  deadlineLabel: string;
  urgent: boolean;
  endDate: Date;
}) {
  return (
    <VStack gap={2}>
      <div className="grid grid-cols-3 gap-2">
        <StatCard value={total} label="신청" />
        <StatCard value={maxPlayers} label="정원" />
        <StatCard value={deadlineLabel} label="마감" urgent={urgent} />
      </div>
      <Card padding="none" className="px-3.5 py-3">
        <Text typography="body3" foreground="muted" render={<p />}>
          마감일 | {formatDateTime(endDate)}
        </Text>
        <Text typography="body3" foreground="muted" render={<p />}>
          마감되면 아래 확정 목록이 그대로 확정됩니다.
        </Text>
      </Card>
    </VStack>
  );
}
