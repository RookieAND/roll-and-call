import { Card, HStack, Text } from "@trpg/ui";

interface ConfirmSummaryProps {
  playLabel: string;
  respondedCount: number;
}

export function ConfirmSummary({ playLabel, respondedCount }: ConfirmSummaryProps) {
  const items = [
    { label: "플레이타임", value: playLabel },
    { label: "가능 시간 제출", value: `${respondedCount}명` },
  ];

  return (
    <div>
      <HStack gap="100">
        {items.map((item) => (
          <Card
            key={item.label}
            radius={500}
            background="none"
            padding="none"
            className="flex-1 px-175 py-150"
          >
            <Text typography="body4" foreground="hint" render={<p />}>
              {item.label}
            </Text>
            <Text numeric typography="heading2" render={<p />} className="mt-050">
              {item.value}
            </Text>
          </Card>
        ))}
      </HStack>
      <Text typography="body4" foreground="hint" render={<p />} className="mt-100">
        시작 시각부터 {playLabel}이 끊기지 않고 비는 시간만 셉니다.
      </Text>
    </div>
  );
}
