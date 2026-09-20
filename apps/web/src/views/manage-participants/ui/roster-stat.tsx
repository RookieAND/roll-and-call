import { Card, Text, VStack } from "@trpg/ui";

export function RosterStat({ label, count }: { label: string; count: number }) {
  return (
    <Card padding="none" className="rounded-500 px-175 py-150">
      <VStack gap="050">
        <Text typography="body4" foreground="muted">
          {label}
        </Text>
        <Text numeric typography="heading2">
          {count}명
        </Text>
      </VStack>
    </Card>
  );
}
