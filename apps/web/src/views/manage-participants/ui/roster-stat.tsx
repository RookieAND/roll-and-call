import { Card, HStack, Text, VStack } from "@trpg/ui";

export function RosterStat({
  label,
  count,
  note,
}: {
  label: string;
  count: number;
  note?: string;
}) {
  return (
    <Card padding="none" className="rounded-xl px-3.5 py-3">
      <VStack gap={1}>
        <Text typography="body4" foreground="muted">
          {label}
        </Text>
        <HStack align="baseline" gap={2}>
          <Text typography="heading1" className="tabular-nums">
            {count}명
          </Text>
          {note && (
            <Text typography="body4" foreground="hint">
              {note}
            </Text>
          )}
        </HStack>
      </VStack>
    </Card>
  );
}
