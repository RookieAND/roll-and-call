import { Card, Text, VStack } from "@roll-and-call/ui";

interface ConfirmPanelStatsProps {
  playLabel: string;
  respondedCount: number;
  confirmedCount: number;
}

// 1100px 이상의 우측 패널 맨 위에 서는 두 수치. 모바일은 본문 위의 ConfirmSummary가 같은 값을 보인다.
export function ConfirmPanelStats({
  playLabel,
  respondedCount,
  confirmedCount,
}: ConfirmPanelStatsProps) {
  return (
    <VStack gap="100">
      <StatCard label="플레이타임" value={playLabel} />
      <StatCard label="가능 시간 제출" value={`${respondedCount} / ${confirmedCount}명`} />
    </VStack>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card.Root radius={500} padding="sm" className="flex flex-col gap-050">
      <Text typography="body4" foreground="hint" render={<p />}>
        {label}
      </Text>
      <Text numeric typography="heading2" render={<p />}>
        {value}
      </Text>
    </Card.Root>
  );
}
