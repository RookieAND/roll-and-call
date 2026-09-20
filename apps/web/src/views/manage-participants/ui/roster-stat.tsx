import { Card, Text, VStack } from "@trpg/ui";

export function RosterStat({ label, count }: { label: string; count: number }) {
  return (
    <Card padding="none" className="rounded-500 px-3.5 py-3">
      <VStack gap={1}>
        <Text typography="body4" foreground="muted">
          {label}
        </Text>
        <Text numeric typography="heading1">
          {count}명
        </Text>
      </VStack>
    </Card>
  );
}
