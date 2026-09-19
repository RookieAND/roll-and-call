import { Card, Text, VStack } from "@trpg/ui";

export function RosterStat({ label, count }: { label: string; count: number }) {
  return (
    <Card padding="none" className="rounded-xl px-3.5 py-3">
      <VStack gap={1}>
        <Text typography="body4" foreground="muted">
          {label}
        </Text>
        <Text typography="heading1" className="tabular-nums">
          {count}명
        </Text>
      </VStack>
    </Card>
  );
}
