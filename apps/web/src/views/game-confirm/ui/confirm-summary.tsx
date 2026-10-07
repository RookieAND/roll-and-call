import { Badge, Card, Grid, HStack, Text, VStack } from "@roll-and-call/ui";

interface ConfirmSummaryProps {
  title: string;
  rule: string;
  respondedCount: number;
  confirmedCount: number;
  playLabel: string;
  deadlineLabel: string;
}

export function ConfirmSummary({
  title,
  rule,
  respondedCount,
  confirmedCount,
  playLabel,
  deadlineLabel,
}: ConfirmSummaryProps) {
  return (
    <VStack gap="200">
      <HStack gap="075" align="center">
        <Text typography="heading3" weight="extrabold" className="min-w-0 flex-1 truncate">
          {title}
        </Text>
        <Badge className="shrink-0">{rule}</Badge>
        <Badge className="shrink-0 tabular-nums">
          가능 시간 제출 {respondedCount} / {confirmedCount}명
        </Badge>
      </HStack>
      <Grid cols={2} gap="100">
        <SummaryCard label="플레이타임" value={playLabel} />
        <SummaryCard label="모집 기한" value={deadlineLabel} />
      </Grid>
    </VStack>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
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
