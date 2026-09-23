import { Card, Grid, Text } from "@roll-and-call/ui";

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
    <Grid cols={2} gap="100">
      {items.map((item) => (
        <Card.Root key={item.label} radius={500} padding="sm" className="flex flex-col gap-050">
          <Text typography="body4" foreground="hint" render={<p />}>
            {item.label}
          </Text>
          <Text numeric typography="heading2" render={<p />}>
            {item.value}
          </Text>
        </Card.Root>
      ))}
    </Grid>
  );
}
